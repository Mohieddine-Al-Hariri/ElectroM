import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const userSlug = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedUserSlug = await client.request(
      `
      mutation PublishUser($userSlug: String!) {
        publishTheUser(where: {slug: $userSlug}) {
          slug
        }
      }
      
      `,
      { userSlug }
    );
    
    return new Response(JSON.stringify(publishedUserSlug)); // Should return the post's title
    // res.status(201).json(newComment.createComment);
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }

  // res.status(405).json({ message: 'Method not allowed.' });
}
