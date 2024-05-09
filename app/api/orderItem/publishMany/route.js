import { GraphQLClient } from "graphql-request";

export async function POST(req) { //TODO: FIX
  const itemsIds = await req.json();

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });


  try {
    const publishedItems = await client.request(
      `
        mutation PublishManyOrderItems($itemsIds: [ID]) {
          publishManyOrderItems(where: {id_in: $itemsIds}) {
            count
          }
        }
      `,
      { itemsIds: itemsIds.map((item) => (item.id)) }
    );
  // try {
  //   const publishedItems = await client.request(
  //     `
  //       mutation PublishManyOrderItems($userId: ID!) {
  //         publishManyOrderItems(where: {theUser: {cart: {id: $userId}}}, to: PUBLISHED) {
  //           count
  //         }
  //       }
  //     `,
  //     { userId }
  //   );
    // console.log(publishedItems)

    //   const queryParts = itemsIds.map((id) => `
    //     publishOrderItem(where: {id: "${id.id}"}, to: PUBLISHED) {
    //       id
    //     }
    //   `);
    //   console.log("queryParts: ", queryParts)

    //   try {
    //     const publishedItems = await client.request(
    //       `
    //         mutation PublishManyOrderItems {
    //           ${queryParts}
    //         }
    //       `,
    //       { itemsIds: itemsIds.map((id) => (id.id)) }
    //     );
    // console.log(publishedItems)
    
    return new Response(JSON.stringify(publishedItems));

  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
