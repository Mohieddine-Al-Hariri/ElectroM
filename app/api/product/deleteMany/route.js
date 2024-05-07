///TODO: FInish making it for -many- products

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
      productsIds,
      imageUrls,
      orderItemsIds,
      reviewsIds,
    } = body;
    
    const mutationQueries = [
      `deleteManyTags(where: { product: { id_in: $productsIds } }) { count }`,
      `deleteManyProductVariants(where: { product: { OR: {id_in: $productsIds} } }) { count }`,
      `deleteManyImageUrls(where: { url_in: $imageUrls }) { count }`,
      
      
      `updateManyOrders(where: {orderItems_every: {OR: {id_in: $orderItemsIds}}}, data: {isRemoved: true}) { count }`,

      `deleteManyOrderItems(where: {product: { OR: {id_in: $productsIds} }}) { count }`,
      `deleteManyReviews(where: {product: { OR: {id_in: $productsIds} }}) { count }`,
      
      `deleteManyProducts(where: { id_in: $productsIds }) { count }`,
    ];
    
    const mutation = `
      mutation DeleteManyProductsAndRelatedEntities(
        $productsIds: [ID],
        $imageUrls: [String!]!,
        $orderItemsIds: [ID],
        
      ) {
        ${mutationQueries.join("\n")}
      }
    `;

    const deletedEntities = await client.request(mutation, {
      productsIds,
      imageUrls,
      orderItemsIds,
      reviewsIds,
    });

    return new Response(JSON.stringify(deletedEntities));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ status: 500, body: error.message }));
  }
}

