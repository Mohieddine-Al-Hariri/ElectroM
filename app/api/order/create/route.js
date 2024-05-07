import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  const { itemsIds, userId, totalPrice, cartId, itemsNames } = body;
  try {
    const submittedOrder = await client.request(
      `
        mutation SubmitOrder($itemsIds: [OrderItemWhereUniqueInput!]!, $itemsIds2: [ID], $userId: ID!, $totalPrice: Float!, $cartId: ID!, $itemsNames: [String!]!) {
          createOrder(
            data: {
              total: $totalPrice
              orderItems: { connect: $itemsIds }
              theUser: { connect: { id: $userId } }
              state: Ordered
              isRemoved: false
              productsNames: $itemsNames
            }
          ) {
            createdAt
            id
            orderItems {
              id
              product {
                name
              }
            }
          }

          updateCart(data: {orderItems: {disconnect: $itemsIds}}, where: {id: $cartId}){
            id
          }

          publishCart(where: {id: $cartId}){
            id
          }

          publishManyOrderItems(where: {id_in: $itemsIds2}) {
            count
          }

        }
      `,
      { itemsIds: itemsIds.map((id) => ({ id })), itemsIds2: itemsIds, userId, totalPrice, cartId, itemsNames }
    );
    console.log("submittedOrder: ", submittedOrder.publishManyOrderItems);

    return new Response(JSON.stringify(submittedOrder)); // Should return the id
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }

}
