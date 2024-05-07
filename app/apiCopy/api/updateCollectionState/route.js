import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  const { state, collectionId } = body;
  try {
    const updatedCollection = await client.request(
      `
        mutation UpdateCollection(
          $collectionId: ID!,
          $state: ProductStates!, 
        ) {
          updateCollection(
            where: {id: $collectionId},
            data: {
              state: $state, 
            }) {
            id
          }
        }
      `,
      {
        collectionId,
        state,
      }
    );
    return new Response(JSON.stringify(updatedCollection));

  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({ status: 500, body: error.message });
  }
}
