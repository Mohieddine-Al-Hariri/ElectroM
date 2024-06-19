import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { v4 as uuidv4 } from "uuid";
import { GraphQLClient, gql } from "graphql-request";
import { compare, hash } from "bcrypt";

const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
  },
});

const GetUserByPhoneNumber = gql`
  query GetUserByPhoneNumber($phoneNumber: Int!) {
    user: theUsers(where: { phoneNumber: $phoneNumber }) {
      id
      password
      slug
      firstName
      lastName
      birthDate
      profileImageUrl
      userRole {
        role
      }
      cart {
        id
      }
      phoneNumber
    }
  }
`; // You can get more field/properties from here

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    user: theUsers(where: { email: $email }, stage: DRAFT) {
      id
      firstName
      lastName
      slug
      email
      profileImageUrl
      userRole {
        role
      }
      cart {
        id
      }
      phoneNumber
    }
  }
`;

const CreateTheUser = gql`
  mutation CreateTheUser(
    $firstName: String!
    $lastName: String!
    $password: String!
    $slug: String!
    $phoneNumber: Int!
    $birthDate: Date!
  ) {
    newUserCart: createCart(
      data: {
        theUser: {
          create: {
            firstName: $firstName
            lastName: $lastName
            password: $password
            phoneNumber: $phoneNumber
            slug: $slug
            birthDate: $birthDate
            userRole: { connect: { id: "clkwj8n4g5z3n0bujxk2vfqpd" } }
          }
        }
      }
    ) {
      theUser {
        id
        slug
        firstName
        lastName
        phoneNumber
        birthDate
        profileImageUrl
        userRole {
          role
        }
      }
      id
    }
  }
`;

const publishUser = gql`
  mutation PublishUser($slug: String!) {
    publishTheUser(where: { slug: $slug }) {
      slug
    }
  }
`;
const publishedCart = gql`
  mutation PublishCart($cartId: ID!) {
    publishCart(where: { id: $cartId }) {
      id
    }
  }
`;

const CreateUserByEmailPass = gql`
  mutation CreateTheUser(
    $email: String!
    $firstName: String!
    $lastName: String!
    $slug: String!
    $profileImageUrl: String!
  ) {
    newUserCart: createCart(
      data: {
        theUser: {
          create: {
            firstName: $firstName
            lastName: $lastName
            slug: $slug
            userRole: { connect: { id: "clkwj8n4g5z3n0bujxk2vfqpd" } }
            email: $email
            profileImageUrl: $profileImageUrl
          }
        }
      }
    ) {
      theUser {
        id
        slug
        firstName
        lastName
        email
        profileImageUrl
        userRole {
          role
        }
      }
      id
    }
  }
`;

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const { user } = await client.request(GetUserByEmail, {
          email: profile.email,
        });
        if (!user || user?.length === 0) {
          const slug = uuidv4();
          const { newUserCart } = await client.request(CreateUserByEmailPass, {
            slug,
            email: profile.email,
            photo: profile.picture,
            profileImageUrl: profile.picture,
            firstName: profile.given_name,
            lastName: profile.family_name,
            birthDate: profile.birthday,
          });
          await client.request(publishUser, { slug });
          await client.request(publishedCart, { cartId: newUserCart.id });
          const newUser = newUserCart.theUser;
          return {
            id: newUser.id,
            user: {
              id: newUser.id,
              firstName: profile.given_name,
              lastName: profile.family_name,
              email: newUser.email,
              slug: newUser.slug,
              profileImageUrl: newUser.profileImageUrl,
              userRole: newUser.userRole.role,
              cartId: newUserCart.id,
            },
          };
        }
        //TODO: Make it more secure??

        return {
          name: user[0].firstName,
          id: user[0].id,
          user: {
            id: user[0].id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            slug: user[0].slug,
            profileImageUrl: user[0].profileImageUrl,
            countryCode: +user[0].phoneNumber?.substring(
              0,
              user[0].phoneNumber.indexOf("_")
            ),
            phoneNumber: user[0].phoneNumber?.slice(
              user[0].phoneNumber.indexOf("_") + 1
            ),
            userRole: user[0].userRole.role,
            countryCodePhoneNumber: user[0].phoneNumber,
            birthDate: user[0].birthDate,
            cartId: user[0].cart.id,
          },
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      // clientSecret: process.env.FACEBOOK_CLIENT_TOKEN
    }),
    CredentialsProvider({
      name: "Phone Number",
      credentials: {
        countryCode: {
          label: "Country Code",
          type: "number",
        },
        phoneNumber: {
          label: "Phone Number",
          type: "number",
          placeholder: "1112223",
        },
        password: {
          label: "Password",
          type: "password",
        },
        firstName: {
          label: "First Name",
          type: "text",
        },
        lastName: {
          label: "Last Name",
          type: "text",
        },
      },
      authorize: async (credentials) => {
        const { password, firstName, lastName, isLogIn, ph, birthDate } =
          credentials;
        const countryPhoneNumber = parseInt(ph);
        const { user } = await client.request(GetUserByPhoneNumber, {
          phoneNumber: countryPhoneNumber,
        });
        console.log(user);

        if (isLogIn === "true" && (user.length === 0 || !user)) {
          throw new Error("Account not found! Sign-Up Instead");
        }
        if (isLogIn === "false" && (!user || user.length === 0)) {
          const slug = uuidv4();
          const hashedPassword = await hash(password, 12);
          const { newUserCart } = await client.request(CreateTheUser, {
            password: hashedPassword,
            firstName,
            lastName,
            slug,
            phoneNumber: countryPhoneNumber,
            birthDate,
          });
          await client.request(publishUser, { slug });
          await client.request(publishedCart, { cartId: newUserCart.id });
          const newUser = newUserCart.theUser;
          return {
            id: newUser.id,
            user: {
              id: newUser.id,
              name: firstName,
              lastName,
              phoneNumber: countryPhoneNumber,
              slug,
              birthDate: newUser.birthDate,
              userRole: newUser.userRole.role,
              cartId: newUserCart.id,
            },
          };
        }
        const isValid = await compare(password, user[0].password);

        if (!isValid) {
          throw new Error("Wrong credentials. Try again.");
        }
        const { id, slug, userRole, phoneNumber, profileImageUrl } = user[0];
        return {
          user: {
            id,
            name: user[0].firstName,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            birthDate: user[0].birthDate,
            slug,
            userRole: userRole.role,
            phoneNumber: phoneNumber,
            profileImageUrl,
            cartId: user[0].cart.id,
          },
        };
      },
    }),
  ],
  //TODO:
  // jwt: {
  //   encode: ({ secret, token }) => {
  //     const encodedToken = jsonwebtoken.sign(
  //       {
  //         ...token,
  //         iss: "grafbase",
  //         exp: Math.floor(Date.now() / 1000) + 60 * 60,
  //       },
  //       secret
  //     );

  //     return encodedToken;
  //   },
  //   decode: async ({ secret, token }) => {
  //     const decodedToken = jsonwebtoken.verify(token, secret);
  //     return decodedToken;
  //   },
  // },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.user = session?.user;
        return token;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/SignIn",
  },
};
export default NextAuth(authOptions);
