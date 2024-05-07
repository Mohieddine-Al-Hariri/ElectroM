import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const reviewId = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedReview = await client.request(
      `
        mutation PublishReview($reviewId: ID!) {
          publishReview(where: {id: $reviewId}) {
            id
          }
        }
      `,
      { reviewId }
    );
    return new Response(JSON.stringify(publishedReview)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
