
import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  try {
    const { cartId, items, userId } = body;
    console.log(items) 
    console.log(items.length) 
    const names= items.map(item => item.orderItemVariants.create).flat()
    console.log(names) 
    const updatedCart = await client.request(
      `
        mutation updateCart(
          $items: OrderItemUpdateManyInlineInput,
          $cartId: ID!
          $names: [String]!
        ) 
        {
          updateCart(data: {orderItems: $items}, where: {id: $cartId}){
            id
            orderItems(last: ${items.length}) {
              id
              stage
            }
          }
          publishCart(where: {id: $cartId}) {
            id
          }
          publishManyOrderItemVariants(where: { name_in: $names }) {
            count
          }
          
        }
      `,
      { items: {create: items}, cartId, userId, last: items.length, names: items.map(item => item.orderItemVariants.create).flat().map(name => name.name) }
    );
    // publishManyOrderItems(where: {theUser: {id: $userId}}, to: PUBLISHED) {
    //   count
    // }

console.log(updatedCart);

    return new Response(JSON.stringify(updatedCart.updateCart));
  
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

}
