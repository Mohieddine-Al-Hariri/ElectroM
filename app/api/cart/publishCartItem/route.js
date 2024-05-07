import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const itemId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedItemId = await client.request(
      `
        mutation PublishCartItem($itemId: ID!) {
          publishOrderItem(where: {id: $itemId}) {
            id
          }
        }
      `,
      { itemId }
    );
    
    return new Response(JSON.stringify(publishedItemId)); // Should return the post's title
    // res.status(201).json(newComment.createComment);
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }

  // res.status(405).json({ message: 'Method not allowed.' });
}
