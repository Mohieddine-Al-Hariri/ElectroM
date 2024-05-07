import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const collectionId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const deletedCollection = await client.request(
      `
        mutation DeleteCollection($collectionId: ID!) {
          deleteCollection(where: {id: $collectionId}) {
            id
          }
        }
      `,
      { collectionId }
    );
    
    return new Response(JSON.stringify(deletedCollection)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
