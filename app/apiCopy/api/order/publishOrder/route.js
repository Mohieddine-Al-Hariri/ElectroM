import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const orderId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedOrder = await client.request(
      `
        mutation PublishOrder($orderId: ID!) {
          publishOrder(where: {id: $orderId}) {
            id
          }
        }
      `,
      { orderId }
    );
    
    return new Response(JSON.stringify(publishedOrder)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
