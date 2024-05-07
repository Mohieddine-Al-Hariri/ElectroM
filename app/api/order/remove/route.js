import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const orderId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const removeOrder = await client.request(
      `
        mutation RemoveOrder($orderId: ID!) {
          updateOrder(data: {isRemoved: true}, where: {id: $orderId}){
            id
          }
        }
      `,
      { orderId }
    );
    
    return new Response(JSON.stringify(removeOrder));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
