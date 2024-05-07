// import ItemCardReview from "@/app/components/ItemCardReview";
import { getOrderProducts, getTheUser } from "@/lib";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ReviewsPage from "../ReviewsPage";
// import { Suspense } from "react";

export async function getUserDetails(userSlug) {
  const userData = await getTheUser(userSlug);
  return userData;
}
export async function getUserOrders(orderId) {
  const orderData = await getOrderProducts(orderId);
  return orderData;
}

const page = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions);
  

  const user = await getUserDetails(session.user.slug);
  const orderData = await getUserOrders(id);

  return (
    <div className="bgColor h-screen flex flex-col gap-3 pt-3 pb-16 overflow-y-scroll w-full ">
      <h1 className="text-2xl text-center fontColor">Reviews</h1>
      
      {orderData.orderItems.length === 0 ? (
        <div className="text-center w-full h-full flex flex-col gap-2 justify-center items-center fontColor ">
          <h1 className="text-2xl">No Products To Review</h1>
          <Link className="border-b-2 borderColor text-xl" href="/">
            Go Shopping{" "}
          </Link>
        </div>
      ):
        <ReviewsPage orderData={orderData} userId={session.user.id} />
      }
      
    </div>
  );
};

export default page;
