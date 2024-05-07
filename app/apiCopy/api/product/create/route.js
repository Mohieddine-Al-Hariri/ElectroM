

import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  const {
    name, slug, description, price, state, imgUrls, excerpt, categories, variants, collections, isOnSale, previousPrice, tags 
  } = body;

  let variantInput = {};
  if (variants.length > 0) {
    variantInput = {
      create: variants.map((variant) => {
        const variantInput = {};
        if (variant.size) {
          variantInput.name = variant.size;
        }
        if (variant.color) {
          variantInput.name = variantInput.name ? `${variantInput.name}/${variant.color}` : variant.color
        }
        if(variant.quantity) variantInput.quantity = variant.quantity;
        return variantInput;
      }),
    };
  }

  const query = `
    mutation CreateProduct(
      $slug: String!
      $imageUrls: [ImageUrlCreateInput!]
      $name: String!
      $excerpt: String!
      $description: String!
      $price: Float!
      $isOnSale: Boolean!
      $previousPrice: Float
      $tags: TagCreateManyInlineInput
      $state: ProductStates!
      $variants: ProductVariantCreateManyInlineInput
      $categories: [CategoryWhereUniqueInput!]
      $collection: [CollectionWhereUniqueInput!]

      $urls: [String!]
    ) {
      
      createProduct(
        data: {
          slug: $slug
          imageUrls: { create: $imageUrls }
          name: $name
          excerpt: $excerpt
          description: $description
          price: $price
          isOnSale: $isOnSale
          previousPrice: $previousPrice
          tags: $tags
          state: $state
          productVariants: $variants
          categories: { connect: $categories }
          collections: { connect: $collection }
        }
      ) {
        id
        imageUrls {
          id
        }
        productVariants {
          id
        }
      }

      publishManyImageUrls(where: {url_in: $urls}) {
        count
      }
      publishManyProductVariants(where: {product: {slug: $slug}}) {
        count
      }
      publishManyTags(where: {product: {slug: $slug}}) {
        count
      }

    }
  `;

  try {
    const createdProduct = await client.request(query, {
      slug,
      imageUrls: imgUrls.map((url) => ({ url })),
      name,
      excerpt,
      description,
      price,
      isOnSale, 
      previousPrice,
      tags: {create: tags.map((tag) => ({name: tag}))},
      state,
      categories: categories.map((category) => ({ id: category })),
      collection: collections.map((collection) => ({ id: collection })),
      variants: variantInput,
      urls: imgUrls,
    });
    
    return new Response(JSON.stringify(createdProduct.createProduct));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(JSON.stringify({ status: 500, body: error.message }), { status: 500 });
  }

}
