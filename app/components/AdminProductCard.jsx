"use client";
import { publishProduct, updateProductState } from "@/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SVGComponent } from "./ProductCard";
import { SVGLoading, SVGPencil, SVGTrash, SVGX } from ".";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

export const ProductStateMenu = ({
  productState,
  setProductState,
  productId,
  isOpen,
  setIsOpen,
  setIsDeleting,
  deleteProductFromDb,
  imageUrls,
  orderItemsIds,
  reviewsIds,
  ordersIds,
}) => {
  const router = useRouter();
  const states = ["Available", "Out_of_Stock", "Removed"];
  // Ref for the card menu container
  const cardMenuRef = useRef(null);

  // Handle click outside the card menu
  const handleClickOutside = (event) => {
    if (cardMenuRef.current && !cardMenuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Add click event listener when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const changeProductState = async (state) => {
    const updatedProduct = await updateProductState({ productId, state });
    await publishProduct(productId);
    //publishOrderItems && publishTheUser??
    setProductState(updatedProduct.updateProduct.state);
    router.refresh();
  };

  const deleteTheProduct = async () => {
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
          setIsDeleting(true);
          await deleteProductFromDb(
            productId,
            imageUrls,
            orderItemsIds,
            reviewsIds,
            ordersIds
          );
          toast.success(
            "Item was deleted succefully. \nIf you can still see them, try refreshing the page.",
            {
              duration: 5000,
              icon: <SVGTrash className="text-[#4bc0d9]  w-[32px]" />,
            }
          );

          // Swal.fire({
          //   icon: "success",
          //   title: "Deleted!",
          //   text: "Your file has been deleted.",
          //   customClass: "staticBgColor fontColorGray",
          //   iconColor: "#4bc0d9",
          //   confirmButtonColor: "#4bc0d9",
          // });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: "<p >Please try again</p>",
          });
        }
        setIsDeleting(false);
      }
    });
  };

  return (
    <div
      ref={cardMenuRef}
      className="absolute w-48 h-10 bgColorGray fontColorGray rounded-t-md right-2 -top-2 pt-1 pr-1 "
    >
      <div>
        <div className="w-full flex justify-end">
          <button
            className="p-1 fontColorGray hover:text-gray-100 hover:bg-[#4bc0d9] rounded-full focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SVGX />
          </button>
        </div>

        <div className="absolute right-0 w-48 fontColor bgColorGray rounded-md shadow-lg z-10">
          <ul>
            {states.map((state) => {
              return (
                <button
                  key={state}
                  disabled={state === productState}
                  onClick={() => {
                    changeProductState(state);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md hover:bg-[#4bc0d9] hover:text-white ${
                    state === productState
                      ? "text-white bg-[#4bc0d9]"
                      : " fontColor "
                  }
                    flex w-full justify-between `}
                >
                  {state}
                </button>
              );
            })}
            <button
              onClick={() => {
                deleteTheProduct();
                setIsOpen(false);
              }}
              className="px-4 py-2 rounded-md text-red-500 hover:bg-red-500 hover:text-white flex w-full justify-between "
            >
              Delete
              <SVGTrash />
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AdminProductCard = ({
  product,
  deleteProductFromDb,
  isSelectAll,
  selectedProductsIds,
  setSelectedProducts,
  index,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [productState, setProductState] = useState(product.state);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selectedProductsIds.includes(product.id));
  }, [isSelectAll, selectedProductsIds]);

  const selectProduct = () => {
    const isIncluded = selectedProductsIds.includes(product.id);
    if (isIncluded && isSelected) {
      setSelectedProducts((prev) =>
        prev.filter((prevProduct) => prevProduct.id !== product.id)
      );
      setIsSelected(false);
    } else if (!isIncluded && !isSelected) {
      setSelectedProducts((prev) => [...prev, product]);
      setIsSelected(true);
    } else if (isIncluded && !isSelected) {
      setIsSelected(true);
    }
  };

  const router = useRouter();

  let stateTxtClr = "text-green-500";
  if (productState === "Removed") stateTxtClr = "text-red-500";
  else if (productState === "Out_of_Stock") stateTxtClr = "text-yellow-500";

  return (
    <div className="flex relative w-full lg:w-1/3 grow justify-between items-center rounded-md shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] productCardBg fontColor p-2 ">
      <div className="absolute right-2 top-2 flex gap-2 justify-center items-center ">
        <button
          className="p-1  rounded-full hover:bg-[#4bc0d9] hover:text-white"
          onClick={() => router.push(`Products/updateProduct/${product.id}`)}
        >
          <SVGPencil />
        </button>
        <input
          className="w-5 h-5 "
          type="checkbox"
          id="select Product"
          name="select Product"
          onChange={selectProduct}
          checked={isSelected}
        />
      </div>
      {product.isOnSale && (
        <SVGComponent className="absolute -rotate-[90deg] -top-[6px] -left-[6px] z-10" />
      )}
      <Image
        className="rounded-t-md"
        src={product.imageUrls[0]?.url}
        alt={product.name}
        width={102}
        height={109.03}
      />
      <div className="w-full flex-col text-center fontColor ">
        <div className=" fontColorGray text-sm font-bold ">
          {product.name.length > 15
            ? product.name.slice(0, 14) + "..."
            : product.name}
        </div>
        <div className=" fontColorGray text-[10px] font-thin ">
          {product.excerpt}
        </div>
        <h1 className="w-full p-1 ">${product.price}</h1>
        {/* <h1 className="w-full p-1 ">{ product.state }</h1> */}
        {openMenu ? (
          <div className="mb-4 relative flex flex-col justify-center items-center ">
            <div className="w-32 relative">
              <ProductStateMenu
                setIsDeleting={setIsDeleting}
                deleteProductFromDb={deleteProductFromDb}
                isOpen={openMenu}
                setIsOpen={setOpenMenu}
                productState={productState}
                setProductState={setProductState}
                productId={product.id}
                imageUrls={product.imageUrls.map((image) => image.url)}
                orderItemsIds={product.orderItems.map((orderItem) => ({
                  id: orderItem.id,
                }))}
                ordersIds={product.orderItems.map((orderItem) => ({
                  order: orderItem.order,
                }))}
                reviewsIds={product.reviews.map((review) => ({
                  id: review.id,
                }))}
              />
            </div>
            <button
              onClick={() => setOpenMenu(true)}
              className="border-2 border-gray-500 rounded-full px-3 py-1 "
            >
              <h1 className={`${stateTxtClr} font-bold`}>{productState}</h1>
            </button>
          </div>
        ) : isDeleting ? (
          <div className="w-full flex justify-center">
            <button
              disabled
              className="border-2 border-gray-500 rounded-full pr-3 pl-5 py-1 mb-4 flex justify-center items-center "
            >
              <SVGLoading />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpenMenu(true)}
            className="border-2 hover:border-[#4bc0d9] border-gray-500 rounded-full px-3 py-1 mb-4  "
          >
            <h1 className={`${stateTxtClr} font-bold`}>{productState}</h1>
          </button>
        )}
        <div className="px-2 ">
          <button
            className="rounded-lg bg-[#4bc0d9] hover:bg-[#3ca8d0] py-1 text-white w-full "
            onClick={() => router.push(`/itemsDetails/${product.id}`)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
