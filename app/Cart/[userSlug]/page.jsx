import Cart from '@/app/components/Cart'
import { getCart } from '@/lib';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
// import { redirect } from 'next/dist/server/api-utils';

export async function getCartData(searchText, userId) {
  const data = (await getCart(searchText, userId)) || [];
  return data;
}

const page = async ({ searchParams: { cursor, searchText } }) => {
  const session = await getServerSession(authOptions);
  let data = {};
  if(session) {
    data = await getCartData(searchText, session.user.cartId);
  }
  return <Cart user={session?.user} cartItems={data.orderItems} hasNextPage={data.pageInfo?.hasNextPage}/>
}

export default page