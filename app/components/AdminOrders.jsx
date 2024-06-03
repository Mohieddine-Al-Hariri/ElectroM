"use client";
import { useEffect, useRef, useState } from "react";
// import OrderCard from "./OrderCard";
import SearchBar from "./SearchBar";
import { deleteManyOrders, deleteOrder, getAdminOrders } from "@/lib";
import { useIsVisible } from "./UseVisible";
import { useRouter } from "next/navigation";
import {
  FilterSelect,
  SVGLoading,
  SVGRefresh,
  SVGTrash,
  ScrollButton,
} from ".";
import Swal from "sweetalert2";
import AdminEachOrderState from "./AdminEachOrderState";

// TODO: Get a Custom Checkbox (Shadcn??)
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
  const [isSelectAll, setIsSelectAll] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isAllCancelledOrdersSelected, setIsAllCancelledOrdersSelected] =
    useState(false);
  const [isAllOrderedOrdersSelected, setIsAllOrderedOrdersSelected] =
    useState(false);
  const [isAllDeletedOrdersSelected, setIsAllDeletedOrdersSelected] =
    useState(false);
  const [isAllDeliveringOrdersSelected, setIsAllDeliveringOrdersSelected] =
    useState(false);
  const [isAllRecievedOrdersSelected, setIsAllRecievedOrdersSelected] =
    useState(false);

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
        setIsSelectAll(false);
        // setIsSelectAllInputState(false);
      });
    }
  }, [isLastOrderCardVisible]);

  useEffect(() => {
    setOrdersState(orders);
    setDoesHaveNextPage(hasNextPage);
  }, [orders, hasNextPage]);

  useEffect(() => {
    if (selected.length >= ordersState.length) {
      setIsSelectAll(true);
      // setIsSelectAllInputState(true);
    } else {
      setIsSelectAll(false);
      // setIsSelectAllInputState(false);
    }
  }, [selected, ordersState]);

  const allState = [
    "Ordered",
    "Delivering",
    "Recieved",
    "Cancelled",
    "Deleted",
  ];

  let orderedOrders = {
      orders: ordersState.filter((order) => order.node.state === "Ordered"),
      isSelectedState: isAllOrderedOrdersSelected,
      setIsSelectedState: setIsAllOrderedOrdersSelected,
    },
    cancelledOrders = {
      orders: ordersState.filter((order) => order.node.state === "Cancelled"),
      isSelectedState: isAllCancelledOrdersSelected,
      setIsSelectedState: setIsAllCancelledOrdersSelected,
    },
    deliveringOrders = {
      orders: ordersState.filter((order) => order.node.state === "Delivering"),
      isSelectedState: isAllDeliveringOrdersSelected,
      setIsSelectedState: setIsAllDeliveringOrdersSelected,
    },
    recievededOrders = {
      orders: ordersState.filter((order) => order.node.state === "Recieved"),
      isSelectedState: isAllRecievedOrdersSelected,
      setIsSelectedState: setIsAllRecievedOrdersSelected,
    },
    deletedOrders = {
      orders: ordersState.filter((order) => order.node.state === "Deleted"),
      isSelectedState: isAllDeletedOrdersSelected,
      setIsSelectedState: setIsAllDeletedOrdersSelected,
    };

  const handleNavigation = (state) => {
    //TODO: Make the search system for orders better (by price, prodicts, email, ...)
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

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
    if (selected.length === 0) return;

    const availableIds = ordersState.map((order) => order.node.id);
    const selectedIds = selected.filter((id) => availableIds.includes(id));
    if (selectedIds.length === 0) {
      setSelected([]);
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      iconColor: "#4bc0d9",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, delete ${selected.length > 1 ? "them" : "it"}!`,
      customClass: "staticBgColor fontColorGray",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteManyOrders(selectedIds);
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Orders have been deleted successfully.",
            customClass: "staticBgColor fontColorGray",
            iconColor: "#4bc0d9",
            confirmButtonColor: "#4bc0d9",
          });

          setSelected([]);
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

  const selectAll = () => {
    if (selected.length >= ordersState.length) {
      setSelected([]);
      setIsSelectAll(false);
      // setIsSelectAllInputState(false);
    } else {
      setSelected(ordersState.map((order) => order.node.id));
      setIsSelectAll(true);
      // setIsSelectAllInputState(true);
    }
  };
  const updateSelectedState = (orders, stateToCheck, setIsSelectedState) => {
    let ordersToCheck = orders.filter(
      (order) => order.node.state === stateToCheck
    );
    let orderIds = ordersToCheck.map((order) => order.node.id);
    if (orderIds.length > 0) {
      let includesAllIds = orderIds.every((id) => selected.includes(id));

      if (!includesAllIds) {
        setSelected((prev) => [...prev, ...orderIds]);
        setIsSelectedState(true);
      } else {
        setSelected((prev) => prev.filter((id) => !orderIds.includes(id)));
        setIsSelectedState(false);
        setIsSelectAll(false);
      }
    }

    // selected = [...new Set(selected)];
    // return selected;
  };

  let array = [
    orderedOrders,
    deliveringOrders,
    recievededOrders,
    cancelledOrders,
    deletedOrders,
  ];
  array = array.filter((item) => item.orders.length > 0);

  return (
    <div className="flex flex-col items-center justify-between p-4 pb-20 h-screen w-screen bgColor overflow-y-scroll overflow-x-hidden fontColor ">
      <div ref={topRef} className="mb-4 fontColor w-full max-w-[350px]">
        <SearchBar resetSearchText={resetSearchText} />
        <div className="flex justify-between max-[340px]:flex-col">
          <FilterSelect
            options={allState.map((item) => ({ name: item }))}
            searchedSelection={filteredState}
            filterBy="State"
            setResetSearchText={setResetSearchText}
          />
          <button
            onClick={handleRefresh}
            className=" refreshButton border-2 duration-200 transition-colors refreshButton font-bold py-2 px-4 rounded max-h-12 self-center"
            disabled={isRefreshing} // Disable the button when refreshing
            title={isRefreshing ? "Refreshing..." : "Refresh"}
          >
            {isRefreshing ? (
              <SVGLoading className="w-6 h-6 inline " />
            ) : (
              <SVGRefresh title="Refresh" className="w-6 h-6 inline" />
            )}
          </button>
          <label
            className={`relative cursor-pointer ${
              isSelectAll
                ? "border-primaryColor"
                : "border-gray-300 hover:border-primaryColor"
            }  transition duration-300 p-1 pb-0 text-xl font-semibold opBorderColor flex min-[340px]:flex-col h-full justify-between items-center min-[280px]:gap-4 `}
            htmlFor="selectAll Orders"
          >
            Select All
            <div className="flex justify-around w-full items-center">
              <input
                className="w-5 h-5"
                type="checkbox"
                id="selectAll Orders"
                name="selectAll Orders"
                onChange={selectAll}
                checked={isSelectAll}
                />
                {selected.length > 0 ? (
                  <button
                    className=" border-b-2"
                    onClick={handleDeleteManyOrders}
                  >
                    <SVGTrash title="Delete Selected Orders" />
                  </button>
                ) : (
                  <button disabled={true} className="dark:text-white/50 text-black/50 border-b-2">
                    <SVGTrash title="Delete Selected Orders" />
                  </button>
                )}
            </div>
          </label>
        </div>
      </div>

      {array.map((item, index) => (
        <AdminEachOrderState
          key={`AdminEachOrderState: ${index}`}
          handleDeleteOrder={handleDeleteOrder}
          updateSelectedState={updateSelectedState}
          item={item}
          isSelectAll={isSelectAll}
          selected={selected}
          setSelected={setSelected}
          index={index}
        />
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
        bgColor="bg-primaryColor"
        textColor="text-white"
      />
    </div>
  );
};

export default AdminOrders;
