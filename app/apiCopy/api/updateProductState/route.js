import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  const { productId, state } = body;
  try {
    const updatedProductId = await client.request( 
      `
        mutation UpdateProduct($state: ProductStates!, $productId: ID!) {
          updateProduct(
            where: {id: $productId}
            data: {state: $state}
          ) {
            id
            state
          }
        }
      `,
      { productId, state }
    );
    return new Response(JSON.stringify(updatedProductId)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
