import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const ordersIds = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const deletedOrders = await client.request(
      `
        mutation DeleteManyOrders($ordersIds: [ID]) {
          deleteManyOrders(where: {id_in: $ordersIds}) {
            count
          }
        }
      `,
      { ordersIds }
    );

    return new Response(JSON.stringify(deletedOrders));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
