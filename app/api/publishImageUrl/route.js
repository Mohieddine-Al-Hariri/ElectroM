import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const imagesIds = await req.json();
  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });

  try {
    const publishedImages = await client.request(
      `
        mutation PublishManyImageUrls($imagesIds: [ID]) {
          publishManyImageUrls(where: { id_in: $imagesIds }){
            count
          }
        }
      `,
      // { imagesIds: ['clldvjfspkab60buo4vanqkm1', 'clldvjfsrkab80buodl6ov0zf'] }
      { imagesIds: imagesIds.map((id) => (id.id)) }
    );
    return new Response(JSON.stringify(publishedImages)); // Should return the post's title
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response({status:500, body: error.message});
  }
}
