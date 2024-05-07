import { GraphQLClient } from "graphql-request";

export async function POST(req) {

  const orderItemsIds = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const deletedItems = await client.request(
      `
        mutation DelteManyItem($orderItemsIds: [OrderItemWhereInput!], $orderItemsIds2: [ID]) {
          deleteManyOrderItemVariants(where: {orderItem: {OR: $orderItemsIds}} ) {
            count
          }
          deleteManyOrderItems(where: {id_in: $orderItemsIds2}) {
            count
          }


        }
      `,
      { orderItemsIds: orderItemsIds.map(id => ({id})), orderItemsIds2: orderItemsIds}
    );

    return new Response(JSON.stringify(deletedItems));
    
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
