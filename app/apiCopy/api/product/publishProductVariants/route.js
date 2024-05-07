import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const productId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedProductVariants = await client.request(
      `
        mutation PublishManyProductVariants($productId: ID) {
          publishManyProductVariants(where: { product: { id: $productId } }) {
            count
          }
        }
      `,
      { productId }
    );
    return new Response(JSON.stringify(publishedProductVariants));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
