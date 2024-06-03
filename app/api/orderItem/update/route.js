import { GraphQLClient } from "graphql-request";

export async function POST(req) {
  const body = await req.json(); 

  const client = new GraphQLClient(process.env.GRAPHYL_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.HYGRAPH_MUTATION_TOKEN}`,
    },
  });
  try {
    console.log(body)
    const { id, variantName, quantity, price, variantId } = body;
    const updatedOrderItem = await client.request(
      `
        mutation UpdateTheUser(
          $id: ID!, 
          $variantName: String!, 
          $variantId: ID!,
          $quantity: Int!, 
          $total: Float!, 
        ) 
          {
            updateOrderItem(
              data: {
                variant: $variantName,
                quantity: $quantity,
                total: $total,
                orderItemVariants: {update: {where: {id: $variantId}, data: {name: $variantName}}},
              }
              where: {id: $id}
            ) 
          {
            id,
            total,
            quantity,
            variant,
            orderItemVariants {name, id}
          }
          publishOrderItem(where: {id: $id}) {
            id
          }
          publishOrderItemVariant(where: {id: $variantId}) {
            id
          }
        }
      `,
      {
        id,
        variantName,
        variantId,
        quantity,
        total: price * quantity,
      }
    );
    console.log("updatedOrderItem: ", updatedOrderItem);
    return new Response(JSON.stringify(updatedOrderItem));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  // res.status(405).json({ message: 'Method not allowed.' });
}
