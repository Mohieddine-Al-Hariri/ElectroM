import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const orderItemId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedVariants = await client.request(
      `
        mutation PublishManyOrderItemVariants($orderItemId: ID!) {
          publishManyOrderItemVariants(where: {orderItem: {id: $orderItemId}}) {
            count
          }
        }
      `,
      { orderItemId }
    );

    return new Response(JSON.stringify(publishedVariants));
    
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
