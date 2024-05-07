import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const collectionId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedCollection = await client.request(
      `
        mutation PublishCollection($collectionId: ID!) {
          publishCollection(where: {id: $collectionId}) {
            id
          }
        }
      `,
      { collectionId }
    );
    
    return new Response(JSON.stringify(publishedCollection)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
