import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  try {
    const { orderId, itemId } = body;
    const updatedOrder = await client.request(
      `
        mutation updateOrder(
          $itemId: ID!,
          $orderId: ID!
        ) 
        {
          updateOrder(where: {id: $orderId}, data: {orderItems: {disconnect: {id: $itemId}}}) {
            id
          }
        }
      `,
      { itemId, orderId }
    );
    return new Response(JSON.stringify(updatedOrder));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  // res.status(405).json({ message: 'Method not allowed.' });
}
