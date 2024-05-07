import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  const { cartId, orderItemId } = body;

  try {
    const publishedCart = await client.request(
      `
        mutation PublishCart($cartId: ID!, $orderItemId: ID!) {
          publishCart(where: {id: $cartId}) {
            id
          }
          publishOrderItem(where: {id: $orderItemId}) {
            id
          }
          publishManyOrderItemVariants(where: {orderItem: {id: $orderItemId}}) {
            count
          }
        }
      `,
      { cartId, orderItemId }
    );
    
    return new Response(JSON.stringify(publishedCart)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
