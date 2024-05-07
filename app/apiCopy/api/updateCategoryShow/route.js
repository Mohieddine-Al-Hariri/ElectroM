import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  
  const { show, categoryId } = body;
  
  try {
    const updateCategory = await client.request(
      `
        mutation updateCategory($categoryId: ID!,$show: Boolean!) {
          updateCategory(data: {show: $show}, where: {id: $categoryId}) {
            id
            show
          }
        }
      `,
      { show, categoryId }
    );

    return new Response(JSON.stringify(updateCategory));

  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }

}
