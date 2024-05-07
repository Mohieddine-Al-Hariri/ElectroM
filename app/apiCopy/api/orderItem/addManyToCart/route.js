import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  try {
    const { cartId, items } = body;
    const updatedCart = await client.request(
      `
        mutation updateCart(
          $items: OrderItemUpdateManyInlineInput,
          $cartId: ID!
        ) 
        {
          updateCart(data: {orderItems: $items}, where: {id: $cartId}){
            id
            orderItems {
              id
            }
          }
        }
      `,
      { items: {create: items}, cartId }
    );
    return new Response(JSON.stringify(updatedCart));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

}
