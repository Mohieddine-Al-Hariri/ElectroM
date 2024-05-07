import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

const AdminEachOrderState = ({
  item,
  isSelectAll,
  updateSelectedState,
  handleDeleteOrder,
  selected,
  setSelected,
  index,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    let isAllIncluded = true; // Assume all are included unless proven otherwise
    for (const order of item.orders) {
      if (!selected.includes(order.node.id)) {
        isAllIncluded = false; // If any id is missing, set it to false
        break; // No need to continue checking
      }
    }
    setIsSelected(isAllIncluded);
  }, [selected, isSelectAll]);
// TODO: Display productsNames to the user + admin
  return (
    <div key={item.orders[0].id}>
      {" "}
      <label
        className={`relative cursor-pointer ${
          isSelected
            ? "border-[#4bc0d9]"
            : "border-gray-300 hover:border-[#4bc0d9]"
        }  transition duration-300 p-2 pb-0 text-xl font-semibold w-full flex justify-between border-b-2 opBorderColor`}
        htmlFor={`select All Order State ${index}`}
      >
        {/* <h1 className="p-2 pb-0 text-xl font-semibold w-full flex justify-between border-b-2 opBorderColor "> */}
        {item.orders[0].node.state}
        <div className="flex gap-1 items-center">

          <p className="opacity-50">Select All</p>
          <input
            className="w-4 h-4"
            type="checkbox"
            id={`select All Order State ${index}`}
            name="select All Order State"
            onChange={() =>
              updateSelectedState(
                item.orders,
                item.orders[0].node.state,
                setIsSelected
              )
            }
            checked={isSelected}
          />
        </div>
        {/* </h1> */}
      </label>
      
      <div className="sm:flex flex-wrap">
        {item.orders.map((order) => (
          <OrderCard
            key={order.node.id}
            setSelected={setSelected}
            order={order.node}
            handleDeleteOrder={handleDeleteOrder}
            selected={selected}
            isSelectAll={isSelectAll}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminEachOrderState;
