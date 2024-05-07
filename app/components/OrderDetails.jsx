"use client";
import { useEffect, useState } from "react";
import OrderStateMenu from "./OrderStateMenu";
import OrderItem from "./OrderItem";
import { deleteOrder } from "@/lib";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrderDetails = ({ order, user }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [orderState, setOrderState] = useState(order.state);
  const router = useRouter();

  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if (isDarkModeLocal) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  let stateColor = "text-green-500";
  if (order.state === "Cancelled" || order.state === "Deleted")
    stateColor = "text-red-500";
  else if (order.state === "Delivering") stateColor = "text-[#4bc0d9]";
  else if (order.state === "Ordered") stateColor = "text-yellow-500";

  const handleDeleteOrder = async () => {
    await deleteOrder(order.id); //TODO: delete its orderItems too?
    router.refresh();
    router.push("/Admin/orders");
  };
//TODO: Allow the user to view item's details after clicking on it
  return (
    <div className="flex flex-col items-center justify-start gap-10 p-4 pb-16 pt-8 h-screen w-screen bgColor fontColor overflow-y-scroll overflow-x-hidden">
      <div className="w-full justify-between flex items-center">
        <button onClick={() => router.back()}>
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 0.9 0.9"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <title>Go Back</title>
            <g
              id="\u9875\u9762-1"
              stroke="none"
              strokeWidth={1}
              fill="none"
              fillRule="evenodd"
            >
              <g id="Arrow" transform="translate(-240)">
                <g id="back_line" transform="translate(240)">
                  <path
                    d="M0.9 0v0.9H0V0h0.9ZM0.472 0.872l0 0 -0.003 0.001 -0.001 0 -0.001 0 -0.003 -0.001c0 0 -0.001 0 -0.001 0l0 0 -0.001 0.016 0 0.001 0 0 0.004 0.003 0.001 0 0 0 0.004 -0.003 0 -0.001 0 -0.001 -0.001 -0.016c0 0 0 -0.001 -0.001 -0.001Zm0.01 -0.004 0 0 -0.007 0.003 0 0 0 0 0.001 0.016 0 0 0 0 0.008 0.003c0 0 0.001 0 0.001 0l0 -0.001 -0.001 -0.023c0 0 0 -0.001 -0.001 -0.001Zm-0.027 0a0.001 0.001 0 0 0 -0.001 0l0 0.001 -0.001 0.023c0 0 0 0.001 0.001 0.001l0.001 0 0.008 -0.003 0 0 0 0 0.001 -0.016 0 0 0 0 -0.007 -0.003Z"
                    id="MingCute"
                    fillRule="nonzero"
                  />
                  <path
                    d="M0.115 0.211A0.037 0.037 0 0 1 0.15 0.188h0.375a0.263 0.263 0 1 1 0 0.525H0.188a0.037 0.037 0 1 1 0 -0.075h0.337a0.188 0.188 0 1 0 0 -0.375H0.241l0.067 0.067a0.037 0.037 0 0 1 -0.053 0.053l-0.131 -0.131a0.037 0.037 0 0 1 -0.008 -0.041Z"
                    id="\u8DEF\u5F84"
                    fill="currentColor"
                  />
                </g>
              </g>
            </g>
          </svg>
        </button>
        
        <h1 className="text-xl font-bold mb-2 border-b-2 border-gray-500">
          ${order.total}
        </h1>
        <div className="fontColor flex justify-center items-start relative ">
          {user.userRole === "Admin" ? 
            openMenu ? (
              <div>
                <OrderStateMenu
                  handleDeleteOrder={handleDeleteOrder}
                  isOpen={openMenu}
                  setIsOpen={setOpenMenu}
                  orderState={orderState}
                  setOrderState={setOrderState}
                  orderId={order.id}
                />
                <button
                  onClick={() => setOpenMenu(true)}
                  className="border-2 border-gray-500 rounded-full px-3 py-1 "
                >
                  <h1 className={`${stateColor} font-bold`}>{orderState}</h1>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenMenu(true)}
                className="border-2 border-gray-500 rounded-full px-3 py-1 "
              >
                <h1 className={`${stateColor} font-bold`}>{orderState}</h1>
              </button>
            )
          : (
            <p className={`border-2 border-gray-500 rounded-full px-3 py-1 ${stateColor} font-bold`}>{orderState}</p>
          )}
        </div>
      </div>
      <div>
        <h1>
          {order.theUser.firstName} {order.theUser.lastName}
        </h1>
        <h1>Location: {order.theUser.location}</h1>
        <h1>
          {order.theUser.phoneNumber
            ? "Phone Number: " + order.theUser.phoneNumber
            : "Email: " + order.theUser.email}
        </h1>
      </div>

      <div className="w-full sm:flex sm:flex-wrap gap-2 ">
        <h1 className="pl-4 mb-4 w-full flex gap-2 flex-wrap"> <span><span className="underline">Items &#40;{order.orderItems.length}&#41;</span>:</span> {order.productsNames.map((name, index) => <div className="">{name}{index < order.productsNames.length - 1 ? "," : ""}</div>)}</h1>
        {/* <h1 className="pl-4 mb-4 w-full flex gap-2 flex-wrap w-full"></h1> */}
        {order.orderItems.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
      {/* Items */}
    </div>
  );
};

export default OrderDetails;
