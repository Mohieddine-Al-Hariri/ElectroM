"use client";
import { publishOrder, removeOrder, updateOrderState } from "@/lib";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SVGCancel, SVGLoading, SVGX } from ".";

const Order = ({ order }) => {
  
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  let stateColor = "text-green-500";
  if (order.state === "Cancelled" || order.state === "Deleted") stateColor = "text-red-500";
  else if(order.state === "Delivering") stateColor = "text-[#4bc0d9]";
  else if(order.state === "Ordered") stateColor = "text-yellow-500";
  
  const cancelOrder = async () => { 
    setCancelling(true);
    await updateOrderState({ orderId: order.id , state: "Cancelled" });
    await publishOrder(order.id);
    router.refresh();
    setCancelling(false);
  }

  const removeOrderFromUsersView = async () => {
    await removeOrder(order.id);
    await publishOrder(order.id);
    router.refresh();
  }

  const item = order.orderItems[0];
  
  return (
    <div className="flex flex-col fontColor gap-2 p-2 h-[100px] border-2 borderColor border-solid rounded-lg">
      <div className="flex gap-2 justify-between items-center h-full">
        {item?.collection ?
          item.collection.imageUrl ?
          <Link href={`/orderDetails/${order.id}`} className="relative h-full w-[70px]">
            <Image className="rounded-md h-full object-cover " src={item.collection.imageUrl} fill alt={item.collection.products[0].name}/>
          </Link>
          :
            <Link href={`/orderDetails/${order.id}`} className="relative rounded-lg aspect-square w-[70px] h-full overflow-hidden flex">
              <div className="w-1/3 h-full overflow-hidden relative">
                <Image src={item.collection.products[0].imageUrls[0].url} className="object-cover " fill alt={item.collection.products[0].name}/>
              </div>
              <div className="w-1/3 h-full overflow-hidden relative">
                <Image src={item.collection.products[1].imageUrls[0].url} className="object-cover " fill alt={item.collection.products[1].name}/>
              </div>
              <div className="w-1/3 h-full overflow-hidden relative">
                <Image src={item.collection.products[2].imageUrls[0].url} className="object-cover " fill alt={item.collection.products[2].name}/>
              </div>
            </Link>
        :
          <Link href={`/orderDetails/${order.id}`} className="relative h-full w-[70px] flex items-start justify-start">
            <Image className="rounded-md object-cover " src={item.product.imageUrls[0]?.url} fill alt={item.product.name}/>
          </Link>
        }
        {/* <Image src={order.orderItems[0].product.imageUrl} /> */}
        <h1 className={`${stateColor} font-bold`}>{order.state}</h1>
        <h1>${order.total}</h1>
        <div className="flex ">
          {order.state !== "Recieved" && order.state !== "Delivering" && order.state !== "Cancelled" &&
            <button disabled={cancelling} onClick={cancelOrder} className="hover:border-black border-2 border-white rounded-md px-2 ">
              {cancelling ? 
                <SVGLoading/>
                : 
                <SVGCancel/>
              }
            </button>
          }
          {(order.state === "Recieved" || order.state === "Cancelled") &&
            <button onClick={removeOrderFromUsersView} title="Remove" className="hover:border-black border-2 border-white rounded-md ">
              <SVGX />
            </button>
          }
        </div>
      </div>
      {order.state === "Recieved" && <Link href={`/ReviewProducts/${order.id}`} className="border-2 border-gray-500 text-[#4bc0d9] text-center text-lg rounded-full px-3 py-1">Review Products</Link>}
    </div>
  )
}

export default Order