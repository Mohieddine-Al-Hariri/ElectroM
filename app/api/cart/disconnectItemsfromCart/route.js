import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    
    const { cartId, itemsIds } = body;

    const updatedCartId = await client.request(
      `
        mutation updateCart(
          $itemsIds: [OrderItemWhereUniqueInput!]!,
          $cartId: ID!
        ) 
        {
          updateCart(data: {orderItems: {disconnect: $itemsIds}}, where: {id: $cartId}){
            id
          }
        }
      `,
      { itemsIds: itemsIds.map((id) => ({ id })), cartId }
    );
    
    return new Response(JSON.stringify(cartId));
  
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
