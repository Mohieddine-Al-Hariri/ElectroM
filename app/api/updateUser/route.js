import { GraphQLClient } from "graphql-request";

/** *************************************************************
* Any file inside the folder app/api is mapped to /api/* and  *
* will be treated as an API endpoint instead of a page.         *
*************************************************************** */

// export a default function for API route to work

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  try {
    const { firstName, lastName, userId, location, imgUrl, birthDate } = body;
    const updatedUser = await client.request(
      `
        mutation UpdateTheUser(
          $userId: ID!, 
          $location: String!, 
          $firstName: String!, 
          $lastName: String!, 
          $imgUrl: String!,
          $birthDate: Date!
        ) 
          {
            updateTheUser(
              data: {
                location: $location, 
                firstName: $firstName, 
                lastName: $lastName, 
                profileImageUrl: $imgUrl,
                birthDate: $birthDate
              }
              where: {id: $userId}
            ) 
          {
            location
            firstName
            id
            lastName
            profileImageUrl
          }
        }
      `,
      {
        location,
        firstName,
        userId,
        lastName,
        imgUrl,
        birthDate
      }
    );
    return new Response(JSON.stringify(updatedUser));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  // res.status(405).json({ message: 'Method not allowed.' });
}
