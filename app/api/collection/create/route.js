import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  const { name, slug, description, price, state, imageUrl, products } = body;

  try {
    const createdCollection = await client.request(
      `
        mutation CreateCollection(
          $name: String!, 
          $slug: String!, 
          $state: ProductStates!, 
          $description: String!, 
          $price: Float!, 
          $products: [ProductWhereUniqueInput!]!
          ${imageUrl ? ", $imageUrl: String!": ""}
          ) {
          createCollection(
            data: {
              name: $name, 
              slug: $slug, 
              state: $state, 
              description: $description, 
              price: $price, 
              products: {connect: $products}
              ${imageUrl ? ", imageUrl: $imageUrl" : ""}
            }) {
            id
          }
        }
      `,
      { name, slug, description, price, state, imageUrl, products }
    );
    // eg of products: [{id: 1}, {id: 2}, ...]

    return new Response(JSON.stringify(createdCollection)); // Should return the id
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }

}
