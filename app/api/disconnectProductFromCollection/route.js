import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  try {
    const { collectionId, productId } = body;
    const updatedCollectionId = await client.request(
      `
        mutation updateCart(
          $productId: ID!,
          $collectionId: ID!
        ) 
        {
          updateCollection(data: {product: {disconnect: $productId}}, where: {id: $collectionId}){
            id
          }
        }
      `,
      { productId, collectionId }
    );
    return new Response(JSON.stringify(collectionId));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
