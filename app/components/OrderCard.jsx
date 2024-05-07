"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import OrderStateMenu from "./OrderStateMenu";
import Link from "next/link";

const OrderCard = ({
  order,
  handleDeleteOrder,
  selected,
  setSelected,
  isSelectAll,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [orderState, setOrderState] = useState(order.state);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selected.includes(order.id));
  }, [isSelectAll, selected]);

  const selectOrder = () => {
    const isIncluded = selected.includes(order.id);
    if (isIncluded && isSelected) {
      setSelected((prev) => prev.filter((id) => id !== order.id));
      setIsSelected(false);
    } else if (!isIncluded && !isSelected) {
      setSelected((prev) => [...prev, order.id]);
      setIsSelected(true);
    } else if (isIncluded && !isSelected) {
      setIsSelected(true);
    }
  };

  let stateColor = "text-green-500";
  if (order.state === "Cancelled" || order.state === "Deleted")
    stateColor = "text-red-500";
  else if (order.state === "Delivering") stateColor = "text-[#4bc0d9]";
  else if (order.state === "Ordered") stateColor = "text-yellow-500";
  const item = order.orderItems[0];

  let source = null;
  if (item?.collection) {
    if (item.collection.imageUrl) source = item.collection.imageUrl;
    else source = item.collection.products;
  } else if (item?.product?.imageUrls) source = item.product.imageUrls[0]?.url;

  return (
    <div
      className={`border border-gray-300 ${
        isImageHovered ? "focus-glow" : ""
      } fontColor rounded-lg relative shadow-md w-64 m-4 grow `}
    >
      <div
        className="h-32 overflow-hidden"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Link href={`/orderDetails/${order.id}`}>
          {source ? (
            Array.isArray(source) ? (
              <div className="aspect-square w-full h-full overflow-hidden flex -space-x-2">
                <Image
                  src={source[0].imageUrls[0].url}
                  width={100}
                  height={100}
                  alt={source[0].name}
                />
                <Image
                  src={source[1].imageUrls[0].url}
                  width={100}
                  height={100}
                  alt={source[1].name}
                />
                <Image
                  src={source[2].imageUrls[0].url}
                  width={100}
                  height={100}
                  alt={source[2].name}
                />
              </div>
            ) : (
              <Image
                height={100}
                width={100}
                src={source}
                alt={item.product?.name || item.collection.products[0].name}
                className="w-full max-w-[500px] h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full bg-black rounded-md"></div>
          )}
        </Link>
      </div>
      <div className="flex flex-col justify-between p-4 h-[calc(100%-128px)] gap-4">
        <div className="fontColorGray gap-1 flex flex-col relative h-full">
          <label
            className="flex items-center border-b-[2px] rounded absolute -top-1 right-[-2px] cursor-pointer"
            htmlFor={`select order: ${order.id}`}
          >
            Select
            <input
              className="ml-2"
              type="checkbox"
              id={`select order: ${order.id}`}
              name={`select order: ${order.id}`}
              onChange={selectOrder}
              checked={isSelected}
            />
          </label>
          <p className="text-base fontColorGray ">Total Price: ${order.total}</p>
          {/* <h2 className="text-xl font-bold mb-2">{order}</h2> */}
          {/* <p className="text-base text-gray-700 mb-4">Location: {order.theUser.location}</p> */}
          <p>
            {order.theUser.firstName} {order.theUser.lastName}
          </p>
          <p>
            Location <br /> {order.theUser.location}
          </p>
          <p>
            {order.theUser.phoneNumber
              ? "Phone Number " + order.theUser.phoneNumber
              : "Email " + order.theUser.email}
          </p>
        </div>
          <div className="fontColor flex justify-center items-start relative ">
            {openMenu ? (
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
                className="hover:border-[#4bc0d9] border-2 border-gray-500 rounded-full px-3 py-1 "
              >
                <h1 className={`${stateColor} font-bold`}>{orderState}</h1>
              </button>
            )}
          </div>
      </div>
    </div>
  );
};

export default OrderCard;
