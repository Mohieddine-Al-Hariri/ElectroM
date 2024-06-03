import Image from "next/image";
import { useEffect, useState } from "react";
import { SVGCancel, SVGCheck, SVGLoading, SVGPencil, SVGTrash } from ".";
import Link from "next/link";
import SVGVisit from "./SVGVisit";

const CartItem = ({
  item,
  deleteItem,
  selectedItemsIds,
  setSelectedItemsIds,
  selectAll,
  handleUpdateItem,
  isEditting,
  setIsEditting,
  isEdittingThisItem,
  isUpdatingItem,
}) => {
  const {
    quantity,
    total,
    product,
    id,
    createdAt,
    variant,
    collection,
    orderItemVariants,
    isCollection,
  } = item;
  const [isSelected, setIsSelected] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // const [isUpdating, setIsUpdating] = useState(false);
  const [chosenQuantity, setChosenQuantity] = useState(quantity || 1);
  const [chosenVariant, setChosenVariant] = useState(orderItemVariants[0].name || 1);

  const [quantityLimit, setQuantityLimit] = useState(1); //control it based on variant.
  const [isReachedLimit, setIsReachedLimit] = useState(false);

  //TODO: If the user chose a variant while having greater amount of items chosen, it should automatically decrease quantity while warning the user it did using some animation.
  // TODO: Add are you sure you want to delete item

  console.log(item);

  useEffect(() => {
    if (!isCollection) {
      product.productVariants.map((productVariant) => {
        if (productVariant.name === orderItemVariants[0].name) {
          setQuantityLimit(productVariant.quantity);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (selectedItemsIds.includes(id)) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectAll]);

  const select = () => {
    if (!isSelected)
      setSelectedItemsIds((prevSelected) => [...prevSelected, id]);
    //when toggled to true
    else
      setSelectedItemsIds((prevSelected) =>
        prevSelected.filter((item) => item !== id)
      ); //when toggled false
    setIsSelected(!isSelected);
  };

  // useEffect(() =>{
  //   setQuantityLimit(chosenVariant.quantity);
  // }, [chosenVariant])

  const increaseQuantity = () => {
    if (quantityLimit !== null && chosenQuantity + 1 > quantityLimit) {
      setIsReachedLimit(true);
      setChosenQuantity(quantityLimit);
      setTimeout(function () {
        setIsReachedLimit(false);
      }, 2000);
      return;
    }
    console.log("+1", chosenQuantity);

    setChosenQuantity((prev) => prev + 1);
  };

  const changeChosenVariant = (selectedVariant) => {
    setChosenVariant(selectedVariant);
    console.log("selectedVariant: ", selectedVariant);
    const selectedVariantQuantity = product.productVariants.find(
      (productVariant) => productVariant.name === selectedVariant
    )?.quantity;

    setQuantityLimit(selectedVariantQuantity);
  };

  return (
    <div
      className={`flex max-[470px]:flex-col max-[470px]:gap-2 max-[470px]:py-2 justify-between items-center w-full lg:w-1/3 grow px-2 border-2 borderColor rounded-lg py-1 ${
        isEditting && !isEdittingThisItem && "brightness-50"
      } `}
    >
      <div className="flex items-center gap-2 max-[470px]:mb-2">
        <label
          className={`relative cursor-pointer ${
            isSelected
              ? "border-primaryColor"
              : "border-gray-300 hover:border-primaryColor"
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
          {!collection ? (
            <Image
              width={86}
              height={108}
              className="w-[86px] h-[108px] rounded-[20px] border-2 border-gray-300 hover:border-primaryColor transition duration-300"
              src={product?.imageUrls[0]?.url}
              alt={product?.name}
            />
          ) : collection.imageUrl ? (
            <Image
              width={86}
              height={108}
              className="w-[86px] h-[108px] rounded-[20px] border-2 border-gray-300 hover:border-primaryColor transition duration-300"
              src={collection.imageUrl}
              alt={collection.name}
            />
          ) : (
            collection.products.slice(0, 3).map((product) => {
              return (
                <Image
                  key={`image: ${product.id}`}
                  width={86}
                  height={108}
                  className="w-[86px] h-[108px] rounded-[20px] border-2 border-gray-300 hover:border-primaryColor transition duration-300"
                  src={product.imageUrls[0]?.url}
                  alt={product.name}
                />
              );
            })
          )}

          <div
            className={`absolute top-0 left-0 ${
              isSelected
                ? "bg-primaryColor text-gray-100 "
                : "bg-white text-gray-600"
            } p-1 rounded-full shadow`}
          >
            {isSelected ? "Selected" : "Select"}
          </div>
        </label>
      </div>
      {/* <div></div> */}
      <div className="w-fit relative flex-col justify-center items-center inline-flex gap-1">
        <Link
          title="View Item"
          href={
            collection
              ? `/collectionDetails/${collection.id}`
              : `/itemsDetails/${product.id}`
          }
          className="fontColorGray text-sm font-bold text-center hover:text-primaryColor transition duration-100 flex"
        >
          {collection ? collection.name : product.name}
          <SVGVisit />
        </Link>
        {product && (
          <div className="w-[114px] fontColorGray text-sm font-thin leading-[10px]">
            {product.excerpt}
          </div>
        )}
        {isEdittingThisItem ? (
          <div
            className={`dark:bg-neutral-700 bg-neutral-100 rounded-full flex justify-between items-center gap-3 fontColor`}
          >
            <button
              onClick={() => {
                if (chosenQuantity > 1 && product.state === "Available")
                  setChosenQuantity((prev) => prev - 1);
                console.log("-1", chosenQuantity - 1);
              }}
              className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
            >
              -
            </button>
            <h3 className="text-2xl">{chosenQuantity}</h3>
            <button
              onClick={increaseQuantity}
              className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
            >
              +
            </button>
          </div>
        ) : (
          <div className="w-[99px] h-[33px] pl-3 pr-[11px] pt-[5px] pb-1 bg-neutral-100 rounded-[22px] justify-center items-start gap-[11px] inline-flex">
            <div className="text-black text-sm font-bold leading-normal">
              {quantity}
            </div>
          </div>
        )}

        {collection ? (
          `${orderItemVariants[0]?.name}...`
        ) : isEdittingThisItem ? (
          <div>
            <select
              onChange={(e) => changeChosenVariant(e.target.value)}
              name="chose variant"
              id="chose variant"
              className="colorScheme w-full py-2 px-4 border rounded focus:focus-glow"
            >
              {product.productVariants.map((productVariant) => (
                <option
                  className="fontColor"
                  key={`variant-${productVariant.name}-${productVariant.id}`}
                  // value={productVariant}
                >
                  {productVariant.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          orderItemVariants[0]?.name
        )}
      </div>

      <div className="text-xl fontColor max-[470px]:flex gap-2 justify-center flex-wrap">
        <h1>Total</h1>
        <h1 className="font-bold text-center">${isEdittingThisItem? chosenQuantity * product.price : total}</h1>
      </div>

      <div className="flex justify-center gap-2 items-center">
        {isEdittingThisItem ? (
          isUpdatingItem ? (
            <SVGLoading />
          ) : (
            <>
              <button onClick={() => setIsEditting("")}>
                <SVGCancel className="hover:text-yellow-500" />
              </button>
              <button
                onClick={() =>{
                  if(chosenVariant === orderItemVariants[0]?.name && chosenQuantity === quantity) {
                    setIsEditting("");
                    return;
                  }
                  handleUpdateItem(
                    id,
                    chosenVariant,
                    chosenQuantity,
                    product.price,
                    orderItemVariants[0]?.id,
                  )
                }}
              >
                <SVGCheck />
              </button>
            </>
            // <ButtonSVG
            //   func={updateCategoryDetails}
            //   text="Submit"
            //   svg={<SVGCheck />}
            // />
          )
        ) : (
          <button onClick={() => setIsEditting(id)}>
            <SVGPencil className="hover:text-primaryColor" />
          </button>
        )}

        <button
          className="hover:text-red-500 transition-colors duration-200"
          disabled={isRemoving}
          onClick={async () => {
            setIsRemoving(true);
            await deleteItem(id);
            setIsRemoving(false);
          }}
        >
          {isRemoving ? (
            <SVGLoading />
          ) : (
            <SVGTrash width="30px" height="30px" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
