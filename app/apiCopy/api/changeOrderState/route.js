import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const { orderId, state } = body
    const updatedOrder = await client.request(
      `
        mutation UpdateOrder($orderId: ID!, $state: Tracking!) {
          updateOrder(data: {state: $state}, where: {id: $orderId}) {
            id
            state
          }
        }
      `,
      { orderId, state }
    );
    return new Response(JSON.stringify(updatedOrder)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
