import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  const { userId, productId, headline, rating, content, orderId, itemId } = body;
  try {
    const reviewProduct = await client.request(
      `
        mutation ReviewProduct($productId: ID!, $userId: ID!, $headline: String!, $rating: Float!, $content: String!, $orderId: ID!, $itemId: ID!) {
          updateProduct(
            where: {id: $productId}
            data: {reviews: {create: {headline: $headline, content: $content, rating: $rating, theUser: {connect: {id: $userId}} }}}
          )
          {
            id
            reviews {
              id
            }
          }
          publishProduct(where: {id: $productId}) {
            id
          }
          updateOrder(where: {id: $orderId}, data: {orderItems: {disconnect: {id: $itemId}}}) {
            id
          }
        }
      `,
      { userId, productId, headline, rating, content, orderId, itemId }
    );
    return new Response(JSON.stringify(reviewProduct.updateProduct)); // Should return the id
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({ status: 500, body: error.message });
  }
}
