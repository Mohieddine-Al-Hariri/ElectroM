import { ProfilePage } from "@/app/components"
import { getOrders, getTheUser } from "@/lib";
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from "next/navigation";

export async function getUserDetails(userSlug) {
  const userData = await getTheUser(userSlug);
  return userData
}
export async function getUserOrders(userId) {
  const ordersData = await getOrders(undefined, undefined, userId);
  return ordersData
}

const page = async ({ params: { slug } }) => {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect('/SignIn');
  }
  const user = await getUserDetails(slug);
  const ordersData = await getUserOrders(session.user.id);
  return <ProfilePage user={user} orders={ordersData.orders} ordersHasNextPage={ordersData.pageInfo.hasNextPage} />
  
}

export default page