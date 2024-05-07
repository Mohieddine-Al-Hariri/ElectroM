"use client"
import { useRouter } from "next/navigation"
import ItemCardReview from "../components/ItemCardReview"
import { publishOrder, publishReview, removeOrder, reviewCollection, reviewProduct } from "@/lib";
import { useState } from "react";
import Link from "next/link";

const ReviewsPage = ({ orderData, userId }) => {
  const router = useRouter();
  const [removedItems, setRemovedItems] = useState([]);

  const submitReview = async (body, isCollection, isLastItem) => {
    console.log("isLastItem: ", isLastItem);
    if(isCollection){
      const reviewedCollection = await reviewCollection(body)
      await publishReview(reviewedCollection.reviews[reviewedCollection.reviews.length - 1].id)

    } else{
      const reviewedProduct = await reviewProduct(body);
      await publishReview(reviewedProduct.reviews[reviewedProduct.reviews.length - 1].id);
    }
    setRemovedItems([...removedItems, body.itemId]);

    //Remove order from user's view if no more items available to review
    if(isLastItem) await removeOrder(body.orderId); 
    await publishOrder(body.orderId);

    router.refresh();
  }

  return (
    <>
      {(orderData.orderItems.every(item => removedItems.includes(item.id)) || orderData.orderItems.length === 0) ? (
        <div className="text-center w-full h-full flex flex-col gap-2 justify-center items-center fontColor ">
          <h1 className="text-2xl">No Products To Review</h1>
          <Link className="border-b-2 borderColor text-xl" href="/">
            Go Shopping{" "}
          </Link>
        </div>
      ):
        orderData.orderItems.map((item, index) => (
          removedItems.includes(item.id) ? null :
          <ItemCardReview
            key={item.id}
            product={item.product}
            collection={item.collection}
            orderId={orderData.id}
            itemId={item.id}
            userId={userId}
            isFirstRender={index === 0}
            isLastItem={orderData.orderItems.length === 1}
            submitReview={submitReview}
          />
        ))
      }
    </>
  )
}
export default ReviewsPage