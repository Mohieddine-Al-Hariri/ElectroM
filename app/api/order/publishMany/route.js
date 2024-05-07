import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const ordersIds = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  console.log("ordersIds in post: ", ordersIds);
  try {
    const publishedOrders = await client.request(
      `
        mutation PublishManyOrders($ordersIds: [ID]) {
          publishManyOrders(where: {id_in: $ordersIds}) {
            count
          }
        }
      `,
      { ordersIds }
    );
    
    return new Response(JSON.stringify(publishedOrders)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
