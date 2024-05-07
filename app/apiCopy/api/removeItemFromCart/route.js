import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const itemId = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const removedItemId = await client.request(
      `
        mutation DeleteOrderItem(
          $itemId: ID!
        ) 
        {
          deleteOrderItem(where: {id: $itemId}){
            id
          }
          deleteManyOrderItemVariants(where: {orderItem: {id: $itemId}}) { count }
        }
      `,
      { itemId }
    );

    return new Response(JSON.stringify(removedItemId));

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

}
