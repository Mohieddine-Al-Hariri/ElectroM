import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const userId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedItems = await client.request(
      `
        mutation PublishManyOrderItems($userId: ID!) {
          publishManyOrderItems(where: {theUser: {id: $userId}}) {
            count
          }
        }
      `,
      { userId }
    );
    return new Response(JSON.stringify(publishedItems));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
