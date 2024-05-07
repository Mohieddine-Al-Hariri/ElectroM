import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const orderId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const deletedOrder = await client.request(
      `
        mutation DeleteOrder($orderId: ID!) {
          deleteOrder(where: {id: $orderId}) {
            id
          }
        }
      `,
      { orderId }
    );
    
    return new Response(JSON.stringify(deletedOrder));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
