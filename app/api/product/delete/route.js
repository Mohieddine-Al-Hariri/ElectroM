import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  try {
    const body = await req.json();
    const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
      headers: {
        authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
      },
    });

    const {
      productId,
      imageUrls,
      orderItemsIds,
      reviewsIds,
    } = body;

    const disconnectOrderQueries = orderItemsIds.map(
      (orderItem) => `
        id_in: "${orderItem}",
      `
    ); 
    
    // updateManyOrders(where: {orderItems_every: {OR: {id_in: $orderItemsIds2}}}, data: {isRemoved: true}) { count } //TODO: TRY
    // `deleteManyOrders( where: { orderItems_every: {OR: {id_in: $orderItemsIds2}} } ) {
    //   count
    // }`,
    const mutationQueries = [
      `deleteManyTags(where: { product: { id: $productId } }) { count }`,
      `deleteManyProductVariants(where: { product: { id: $productId } }) { count }`,
      `deleteManyImageUrls(where: { url_in: $imageUrls }) { count }`,
      
      `updateManyOrders(where: {orderItems_every: {OR: {id_in: $orderItemsIds2}}}, data: {isRemoved: true}) { count }`,
      `deleteManyOrderItems(where: {product: {id: $productId}}) { count }`,
      `deleteManyReviews(where: {product: {id: $productId}}) { count }`,
      
      `deleteProduct(where: { id: $productId }) { id }`,
    ];
    
    const mutation = `
      mutation DeleteProductAndRelatedEntities(
        $productId: ID!,
        $imageUrls: [String!]!,
        
        $orderItemsIds2: [ID],
        
      ) {
        ${mutationQueries.join("\n")}
      }
    `;

    const deletedEntities = await client.request(mutation, {
      productId,
      imageUrls,
      orderItemsIds,
      orderItemsIds2: orderItemsIds.map((id) => (id.id)),
      reviewsIds,
    });
    console.log("deletedEntities: ", deletedEntities)
    return new Response(JSON.stringify(deletedEntities.deleteProduct));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ status: 500, body: error.message }));
  }
}

