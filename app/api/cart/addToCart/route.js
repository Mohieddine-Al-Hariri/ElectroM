import { GraphQLClient } from "graphql-request";

export async function POST(req) {

  const body = await req.json();

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  const { itemId, userSlug, quantity, totalPrice, cartId, chosenProductsVariants, isCollection } = body;

  const variantsInput = {
    create: chosenProductsVariants.map((variant) => ({
      name: variant,
    }))
  }

  try {
    const isItemAdded = await client.request(
      `
        mutation UpdateCart($itemId: ID!, $userSlug: String!, $quantity: Int!, $totalPrice: Float!, $cartId: ID!, $variants: OrderItemVariantCreateManyInlineInput) {
          updateCart(
            where: {id: $cartId}
            data: {orderItems: {create: {quantity: $quantity, total: $totalPrice, orderItemVariants: $variants, ${isCollection? "collection" : "product"}: {connect: {id: $itemId}}, theUser: {connect: {slug: $userSlug}}}}}
          ) {
            id
            orderItems(first: 1, orderBy: createdAt_DESC) {
              id
            }
          }
        }
      `,
      { itemId, userSlug, quantity, totalPrice, cartId, variants: variantsInput }
    );

    return new Response(JSON.stringify(isItemAdded)); 
    
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }

}
