import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const categoryId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const deletedCategory = await client.request(
      `
        mutation DeleteCategory($categoryId: ID!) {
          deleteCategory(where: {id: $categoryId}) {
            id
          }
        }
      `,
      { categoryId }
    );
    
    return new Response(JSON.stringify(deletedCategory)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
