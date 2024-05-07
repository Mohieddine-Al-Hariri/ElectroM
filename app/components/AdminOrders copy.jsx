"use client";
import { useEffect, useRef, useState } from "react";
import OrderCard from "./OrderCard";
import SearchBar from "./SearchBar";
import { deleteOrder, getAdminOrders } from "@/lib";
import { useIsVisible } from "./UseVisible";
import { useRouter } from "next/navigation";
import { FilterSelect, ScrollButton } from ".";
import Swal from "sweetalert2";
// import Link from "next/link";
// TODO: Add select (deleteSelected, cancel...) - SelectAll
// TODO: Add selectAll for each category seperately (ordered, cancelled, ...)
const AdminOrders = ({ orders, hasNextPage, searchText, filteredState }) => {
  const [ordersState, setOrdersState] = useState([]);

  //Pagination
  const [lastOrderCursor, setLastOrderCursor] = useState(
    orders[orders.length - 1]?.cursor
  );
  const [doesHaveNextPage, setDoesHaveNextPage] = useState(hasNextPage);
  const lastOrderCardRef = useRef();
  const isLastOrderCardVisible = useIsVisible(lastOrderCardRef);
  const [isFirstRedner, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(filteredState || "All");
  const [resetSearchText, setResetSearchText] = useState(false);
  const [selected, setSelected] = useState([]);

  const topRef = useRef(null);
  const isTopButtonVisible = useIsVisible(topRef);

  const router = useRouter();

  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if (isDarkModeLocal) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  const getMoreOrders = async () => {
    const paginatedOrders = await getAdminOrders(
      lastOrderCursor,
      searchText,
      filteredState
    );
    return paginatedOrders;
  };
  useEffect(() => {
    if (isFirstRedner) {
      setIsFirstRender(false);
    } else if (doesHaveNextPage && !isLoading) {
      setIsLoading(true);
      getMoreOrders().then((result) => {
        result.pageInfo.hasNextPage &&
          setLastOrderCursor(result.orders[result.orders.length - 1].cursor); //result.ordersConnection.edges
        setDoesHaveNextPage(result.pageInfo.hasNextPage);
        setOrdersState([...ordersState, ...result.orders]);
        setIsFirstRender(true);
        setIsLoading(false);
      });
    }
  }, [isLastOrderCardVisible]);

  useEffect(() => {
    setOrdersState(orders);
    setDoesHaveNextPage(hasNextPage);
  }, [orders, hasNextPage]);

  const allState = [
    "Ordered",
    "Delivering",
    "Recieved",
    "Cancelled",
    "Deleted",
  ];
  //TO DO: Remove Deleted?
  let orderedState = [],
    deliveringState = [],
    recievedState = [],
    cancelledState = [],
    deletedState = [];

  ordersState.map((order) => {
    if (order.node.state === "Ordered") orderedState.push({...order, isSelected: false});
    else if (order.node.state === "Recieved") recievedState.push({...order, isSelected: false});
    else if (order.node.state === "Delivering") deliveringState.push({...order, isSelected: false});
    else if (order.node.state === "Cancelled") cancelledState.push({...order, isSelected: false});
    else if (order.node.state === "Deleted") deletedState.push({...order, isSelected: false});
  });

  const handleNavigation = (state) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (state === "All") currentParams.delete("filteredState");
    else currentParams.set("filteredState", state);
    currentParams.delete("cursor");
    currentParams.delete("search");

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;
    setResetSearchText(!resetSearchText);
    router.push(newPathname);
  };
  useEffect(() => {
    handleNavigation(selectedState);
  }, [selectedState]);

  const handleDeleteOrder = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "#4bc0d9",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: "staticBgColor fontColorGray",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder(id);
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your file has been deleted.",
            customClass: "staticBgColor fontColorGray",
            iconColor: "#4bc0d9",
            confirmButtonColor: "#4bc0d9",
          });
          router.refresh();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: "<p>Please try again</p>",
            customClass: "staticBgColor fontColorGray",
          });
        }
      }
    });
  };

  const handleDeleteManyOrders = async () => {
    //selected includes the ids 
  }

  const selectAll = () =>
    setSelected(() => orders.map((order) => ({id: order.node.id, state: order.node.id}))); //CONTINUE
  const selectAllOrderred = () =>
    setSelected(() =>
      orders
        .filter((order) => order.node.state === "Ordered")
        .map((order) => order.node.id)
    ); //CONTINUE
  const selectAllCancelled = () =>
    setSelected(() =>
      orders
        .filter((order) => order.node.state === "Cancelled")
        .map((order) => order.node.id)
    ); //CONTINUE
  const selectAllDeleted = () =>
    setSelected(() =>
      orders
        .filter((order) => order.node.state === "Deleted")
        .map((order) => order.node.id)
    ); //CONTINUE
  const selectAllDelivering = () =>
    setSelected(() =>
      orders
        .filter((order) => order.node.state === "Delivering")
        .map((order) => order.node.id)
    ); //CONTINUE
  const selectAllRecieved = () =>
    setSelected(() =>
      orders
        .filter((order) => order.node.state === "Recieved")
        .map((order) => order.node.id)
    ); //CONTINUE

  let array = [
    orderedState,
    deliveringState,
    recievedState,
    cancelledState,
    deletedState,
  ];
  array = array.filter((item) => item.length > 0);

  return (
    <div className="flex flex-col items-center justify-between p-4 pb-20 h-screen w-screen bgColor overflow-y-scroll overflow-x-hidden fontColor ">
      <div ref={topRef} className="mb-4 fontColor ">
        <SearchBar resetSearchText={resetSearchText} />
        <FilterSelect
          options={allState.map((item) => ({ name: item }))}
          searchedSelection={filteredState}
          filterBy="State"
          setResetSearchText={setResetSearchText}
        />
      </div>
      {/*  {ordersState.map((order) => (
        <OrderCard key={order.node.id} order={order.node} />
      ))} */}
      {array.map((item) => (
        <div key={item[0].node.id}>
          <h1 className="p-2 pb-0 text-xl font-semibold w-full text-center border-b-2 opBorderColor ">
            {item[0].node.state}
          </h1>

          <label
            className={`relative cursor-pointer ${
              isSelected
                ? "border-[#4bc0d9]"
                : "border-gray-300 hover:border-[#4bc0d9]"
            } border-2 rounded-[20px] transition duration-300`}
            htmlFor={`selectItem ${id}`}
          >
            <input
              className="hidden"
              type="checkbox"
              id={`selectItem ${id}`}
              name="selectItem"
              onChange={select}
              checked={isSelected}
            />
          </label>

          <div className="sm:flex flex-wrap">
            {item.map((order) => (
              <OrderCard
                key={order.node.id}
                setSelected={setSelected}
                order={order.node}
                handleDeleteOrder={handleDeleteOrder}
              />
            ))}
          </div>
          
        </div>
      ))}

      {/* Pagination controls */}
      {isLoading && (
        <div className="flex relative h-40 w-full backGround fontColor text-2xl justify-center items-center rounded-lg ">
          Loading...
        </div>
      )}
      {!doesHaveNextPage && (
        <div className="flex relative h-40 w-full backGround fontColor text-2xl justify-center items-center rounded-lg ">
          All Done!{" "}
        </div>
      )}
      {/* Add an invisible element to act as the previousPostCardRef */}
      <div ref={lastOrderCardRef} style={{ visibility: "hidden" }} />

      <ScrollButton
        rotationDegree={0}
        refe={topRef}
        isObservedElementVisible={isTopButtonVisible}
        bgColor="bg-[#4bc0d9]"
        textColor="text-white"
      />
    </div>
  );
};

export default AdminOrders;



