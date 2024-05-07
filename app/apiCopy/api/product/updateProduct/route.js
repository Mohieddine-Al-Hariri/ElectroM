import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  const {
    productId,
    name,
    imageUrls,
    removedImagesIds,
    excerpt,
    description,
    price,
    isOnSale,
    prevPrice,
    tags,
    previousTags,
    state,
    variants,
    previousVariants,
    categories,
    previousCategories,
    collections,
    previousCollections

  } = body;

  let variantInput = [];
  if (variants.length > 0) {
    variantInput = 
      variants.map((variant) => {
        const variantInput = {};
        if (variant.size) {
          variantInput.name = variant.size;
        }
        if (variant.color) {
          variantInput.name = variantInput.name ? `${variantInput.name}/${variant.color}` : variant.color
        }
        if(variant.quantity !== null) variantInput.quantity = variant.quantity;
        return variantInput;
      });
  }
  
  const query = `
    mutation updateProduct(
      $productId: ID!
      $name: String!
      $imageUrls: [ImageUrlCreateInput!]
      $removedImagesIds: [ImageUrlWhereUniqueInput!]
      $excerpt: String!
      $description: String!
      $price: Float!
      $isOnSale: Boolean!
      $prevPrice: Float!
      $previousTags: [TagWhereUniqueInput!]
      $tags: [TagCreateInput!]
      $state: ProductStates!
      $previousVariants: [ProductVariantWhereUniqueInput!]
      $variants: [ProductVariantCreateInput!]
      $categories: [CategoryConnectInput!]
      $previousCategories: [CategoryWhereUniqueInput!]
      $collections: [CollectionConnectInput!]
      $previousCollections: [CollectionWhereUniqueInput!]
    ) {
      updateProduct(
        where: {id: $productId}
        data: {
          name: $name, 
          imageUrls: {create: $imageUrls, delete: $removedImagesIds }, 
          excerpt: $excerpt, 
          description: $description, 
          price: $price, 
          isOnSale: $isOnSale,
          previousPrice: $prevPrice,
          tags: {delete: $previousTags, create: $tags}, 
          state: $state, 
          productVariants: {delete: $previousVariants, create: $variants}, 
          categories: {disconnect: $previousCategories, connect: $categories},
          collections: {disconnect: $previousCollections, connect: $collections}
        }
      ) {
        id
        imageUrls{
          id
        }
        productVariants{
          id
        }
      }
    }
  `;

  try {
    const updatedProduct = await client.request( 
      query,
      {
        productId,
        name,
        imageUrls,
        removedImagesIds: removedImagesIds.map(id => ({id})),
        excerpt,
        description,
        price,
        isOnSale,
        prevPrice,
        tags,
        previousTags,
        state,
        variants: variantInput,
        previousVariants,
        categories: categories.map((category) => ({where: { id: category }})),
        previousCategories,
        collections: collections.map((collection) => ({where: { id: collection }})),
        previousCollections
      }
    );
    
    return new Response(JSON.stringify(updatedProduct.updateProduct)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({ status: 500, body: error.message });
  }
}
