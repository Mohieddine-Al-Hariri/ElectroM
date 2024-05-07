
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getOrderDetails } from "@/lib";
import OrderDetails from "@/app/components/OrderDetails";

export async function getOrderData(orderId) {
  const OrderDetails = (await getOrderDetails(orderId)) || [];
  return OrderDetails;
}

const page = async ({ params: { id } }) => {
  const sessionData = await getServerSession(authOptions);
  const orderDetails = await getOrderData(id);
  return <OrderDetails order={orderDetails} user={sessionData?.user} />
}

export default page