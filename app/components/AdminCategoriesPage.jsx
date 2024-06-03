"use client";

import {
  deleteCategory,
  publishCategory,
  updateCategory,
  updateCategoryState,
} from "@/lib";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CreateCategoryForm from "./CreateCategoryForm";
import {
  SVGCancel,
  SVGCheck,
  SVGLoading,
  SVGPencil,
  SVGRefresh,
  SVGTrash,
  SelectionProductCard,
} from ".";
import Swal from "sweetalert2";

export const ButtonSVG = ({ func, text, svg, hoverColor }) => (
  <button
    className={`flex justify-between items-center max-sm:w-fit max-sm:flex-col w-full ${
      hoverColor ? `hover:${hoverColor}` : "hover:text-primaryColor"
    }`}
    onClick={func}
  >
    {text}
    {svg}
  </button>
);

const CategoryCard = ({
  category,
  products,
  hasNextPage,
  hasPreviousPage,
  productsPageNumber,
  isFetching,
  getOtherProducts,
  deleteTheCategory,
}) => {
  const [show, setShow] = useState(category.show);
  const [isUpdatingShow, setIsUpdatingShow] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const [updatingCategoryName, setUpdatingCategoryName] = useState(false);
  const [description, setDescription] = useState(category.description || "");

  const [includedProducts, setIncludedProducts] = useState([]);
  const [prevIncludedProducts, setPrevIncludedProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIncludedProducts(
      category.products.map((product) => ({
        id: product.id,
        imageUrls: product.imageUrls,
        name: product.name,
      }))
    );
  }, [updatingCategoryName]);
  useEffect(() => {
    setShow(category.show);
    setIncludedProducts(
      category.products.map((product) => ({
        id: product.id,
        imageUrls: product.imageUrls,
        name: product.name,
      }))
    );
  }, [category]);

  const include = (isIncluded, product) => {
    // Check if the product should be included
    if (isIncluded) {
      // Remove from the includedProducts category
      setIncludedProducts((prevIncluded) =>
        prevIncluded.filter((item) => item.id !== product.id)
      );

      // Check if the product was previously in the category
      const isInPrev = category.products.some((item) => item.id === product.id);

      // Add to prevIncluded, only if it was connected to the category previously in DB
      // else, Add to displayedProducts
      isInPrev
        ? setPrevIncludedProducts((prevIncluded) => [...prevIncluded, product])
        : setDisplayedProducts((prevDisplayed) => [
            ...prevDisplayed,
            { node: product },
          ]);

      // No need to update displayedProducts in this case
      return;
    }

    // Add to the includedProducts category
    setIncludedProducts((prevIncluded) => [...prevIncluded, product]);

    // Remove from prevIncluded if it was in it
    setPrevIncludedProducts((prevIncluded) =>
      prevIncluded.filter((item) => item.id !== product.id)
    );

    // Remove from displayedProducts if it was in it
    setDisplayedProducts((prevDisplayed) =>
      prevDisplayed.filter((item) => item.node.id !== product.id)
    );
  };

  const updateDisplayedProducts = () => {
    const filteredProducts = products
      .map((product) => {
        // Initialize a flag to check if the product is included
        let isIncluded = false;

        // Check if the product is in the includedProducts array
        for (const includedProduct of category.products) {
          if (includedProduct.id === product.node.id) {
            isIncluded = true;
            break; // Exit the loop once a match is found
          }
        }

        // Return null for products that should not be rendered; else, continue checking
        if (isIncluded) return null;

        // Check if the product is in the prevIncludedProducts array
        for (const prevIncludedProduct of prevIncludedProducts) {
          if (prevIncludedProduct.id === product.node.id) {
            isIncluded = true;
            break; // Exit the loop once a match is found
          }
        }

        // If the product is not in includedProducts and prevIncludedProducts,
        // render the ProductCard
        if (!isIncluded) {
          return product;
        }
        // Return null for products that should not be rendered
        return null;
      })
      .filter((item) => item !== null);
    setDisplayedProducts(filteredProducts);
  };
  useEffect(() => {
    updateDisplayedProducts();
  }, [products]);

  const updateCategoryDetails = async () => {
    if (!categoryName) {
      setIsError(true);
      setTimeout(function () {
        setIsError(false);
      }, 2000);
      return;
    }

    // Initialize a variable to track if all products in includedProducts are the same as products in category.products
    const areAllProductsSame = includedProducts.every((includedProduct) =>
      // Check if there is at least one product in category.products with the same id as the current includedProduct
      category.products.some((product) => includedProduct.id === product.id)
    );

    if (
      //Make sure something is changed before submission
      categoryName === category.name &&
      description === category.description &&
      prevIncludedProducts.length === 0 &&
      areAllProductsSame &&
      !isUpdating &&
      !isDeleting &&
      category.products.length === includedProducts.length
    )
      return;

    setIsUpdating(true);
    const productIdsInCategory = new Set(
      category.products.map((product) => product.id)
    );
    const productsToInclude = includedProducts
      .filter((product) => !productIdsInCategory.has(product.id))
      .map((product) => ({ where: { id: product.id } }));
    const updatedCategory = await updateCategory({
      categoryId: category.id,
      name: categoryName,
      show,
      description,
      products: productsToInclude,
      prevProducts: prevIncludedProducts.map((product) => ({ id: product.id })),
    });
    await publishCategory(category.id);
    router.refresh();
    resetCollectionDetailsFunc();
    setUpdatingCategoryName(false);
    setIsUpdating(false);
  };
  const updateCategoryShowState = async () => {
    setIsUpdatingShow(true);
    const showState = !show;
    const updatedCategory = await updateCategoryState({
      categoryId: category.id,
      show: showState,
    });
    await publishCategory(category.id);
    router.refresh();
    setShow(!show);
    setIsUpdatingShow(false);
  };
  const cancelUpdateCategory = () => {
    setUpdatingCategoryName(false);
    setShow(category.show);
    setCategoryName(category.name);
    setDescription(category.description);
  };

  const deleteCategoryFunc = async () => {
    setIsDeleting(true);
    await deleteTheCategory(category.id);
    setIsDeleting(false);
  };
  const resetCollectionDetailsFunc = async () => {
    setShow(category.show);
    setCategoryName(category.name);
    setDescription(category.description);
    setIncludedProducts(
      category.products.map((product) => ({
        id: product.id,
        imageUrls: product.imageUrls,
        name: product.name,
      }))
    );
    setPrevIncludedProducts([]);
    updateDisplayedProducts();
  };

  return (
    <div
      className={`flex flex-col border-2 ${
        show ? "borderColor fontColor" : "border-gray-500 fontColorGray"
      } rounded-lg p-2`}
    >
      <div
        className={` flex justify-between ${
          updatingCategoryName ? "max-sm:flex-col-reverse gap-2 mb-2" : ""
        } `}
      >
        <div>
          {updatingCategoryName ? (
            <div className="flex flex-col justify-around items-center h-full">
              <label htmlFor="name">
                <h1>Name</h1>

                <input
                  id="name"
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="rounded-md border-2 p-2 borderColor colorScheme"
                />
              </label>
              <label htmlFor="description">
                <h1>Brief Description</h1>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-md border-2 p-2 borderColor colorScheme"
                />
              </label>
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold">{category.name}</h1>
              <h2>{category.description}</h2>
            </div>
          )}
        </div>
        {isError && <p className="text-red-500">Please provide a name </p>}

        <div
          className={`flex gap-4 items-start ${
            updatingCategoryName
              ? "sm:flex-col max-sm:flex-wrap sm:w-1/6 w-full max-sm:justify-evenly items-end"
              : ""
          }`}
        >
          {updatingCategoryName ? (
            isUpdating ? (
              <SVGLoading />
            ) : (
              <ButtonSVG
                func={updateCategoryDetails}
                text="Submit"
                svg={<SVGCheck />}
              />
            )
          ) : (
            <button onClick={() => setUpdatingCategoryName(true)}>
              <SVGPencil className="hover:text-primaryColor" />
            </button>
          )}
          {isUpdatingShow ? (
            <SVGLoading />
          ) : show ? (
            <ButtonSVG
              func={updateCategoryShowState}
              text={updatingCategoryName ? "Hide" : ""}
              hoverColor="text-yellow-500"
              svg={
                <svg
                  fill="currentColor"
                  width="30px"
                  height="30px"
                  viewBox="0 -0.6 20.4 20.4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Hide from user</title>
                  <path d="M10.2 15q-2.512 0 -4.537 -1.462 -2.063 -1.462 -3.262 -3.938 1.2 -2.475 3.262 -3.938 2.025 -1.462 4.537 -1.462 2.4 0 4.5 1.537 2.1 1.5 3.3 3.862 -1.2 2.362 -3.3 3.9 -2.1 1.5 -4.5 1.5Zm0 -1.8q1.5 0 2.55 -1.05t1.05 -2.55q0 -1.5 -1.05 -2.55t-2.55 -1.05q-1.5 0 -2.55 1.05t-1.05 2.55q0 1.5 1.05 2.55t2.55 1.05Zm0 -1.5q-0.862 0 -1.462 -0.6 -0.637 -0.637 -0.637 -1.5t0.637 -1.462q0.6 -0.637 1.462 -0.637t1.5 0.637q0.6 0.6 0.6 1.462t-0.6 1.5q-0.637 0.6 -1.5 0.6Z" />
                </svg>
              }
            />
          ) : (
            <ButtonSVG
              func={updateCategoryShowState}
              text={updatingCategoryName ? "Show" : ""}
              hoverColor="text-yellow-500"
              svg={
                <svg
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30px"
                  height="30px"
                  viewBox="0 0 1.95 1.95"
                  enableBackground="new 0 0 52 52"
                  xmlSpace="preserve"
                >
                  <title>Show to user</title>
                  <g>
                    <path d="M1.942 0.941c-0.06 -0.12 -0.139 -0.229 -0.236 -0.315L1.387 0.941v0.034c0 0.229 -0.184 0.412 -0.412 0.412h-0.034l-0.203 0.203c0.075 0.015 0.154 0.026 0.232 0.026 0.424 0 0.791 -0.247 0.968 -0.604 0.015 -0.026 0.015 -0.049 0.004 -0.071z" />
                    <path d="m1.819 0.21 -0.079 -0.079c-0.022 -0.022 -0.064 -0.019 -0.09 0.011l-0.274 0.274C1.252 0.364 1.117 0.337 0.975 0.337 0.551 0.337 0.184 0.585 0.007 0.941c-0.011 0.022 -0.011 0.049 0 0.068 0.083 0.169 0.206 0.307 0.36 0.412l-0.225 0.229c-0.026 0.026 -0.03 0.068 -0.011 0.09l0.079 0.079c0.022 0.022 0.064 0.019 0.09 -0.011L1.808 0.3c0.03 -0.026 0.034 -0.068 0.011 -0.09zM0.563 0.975c0 -0.229 0.184 -0.412 0.412 -0.412 0.075 0 0.142 0.019 0.203 0.052l-0.112 0.112c-0.03 -0.007 -0.06 -0.015 -0.09 -0.015 -0.146 0 -0.263 0.116 -0.263 0.263 0 0.03 0.007 0.06 0.015 0.09l-0.112 0.112C0.581 1.117 0.563 1.05 0.563 0.975z" />
                  </g>
                </svg>
              }
            />
          )}
          {!updatingCategoryName ? (
            isDeleting ? (
              <SVGLoading />
            ) : (
              <button onClick={deleteCategoryFunc}>
                <SVGTrash
                  className="hover:text-red-500"
                  width="30px"
                  height="30px"
                />
              </button>
            )
          ) : (
            <>
              <ButtonSVG
                func={cancelUpdateCategory}
                text="Cancel"
                svg={<SVGCancel width="30px" height="30px" />}
              />
              <ButtonSVG
                func={resetCollectionDetailsFunc}
                text="Default"
                svg={
                  <svg
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 30 30"
                    enableBackground="new 0 0 32 32"
                    xmlSpace="preserve"
                    width={30}
                    height={30}
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.875}
                      strokeMiterlimit={10}
                      d="M24.094 10.219C22.406 6.938 18.938 4.688 15 4.688c-4.406 0 -8.063 2.719 -9.563 6.563"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.875}
                      strokeMiterlimit={10}
                      d="M5.813 19.688c1.688 3.281 5.156 5.625 9.188 5.625 4.406 0 8.063 -2.719 9.563 -6.563"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.875}
                      strokeMiterlimit={10}
                      points="26,5 26,11 20,11 "
                      d="M24.375 4.688L24.375 10.313L18.75 10.313"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.875}
                      strokeMiterlimit={10}
                      points="6,27 6,21 12,21 "
                      d="M5.625 25.313L5.625 19.688L11.25 19.688"
                    />
                  </svg>
                }
              />
            </>
          )}
        </div>
      </div>
      {updatingCategoryName && (
        <div className="flex flex-col gap-3 mt-3">
          <h1 className="text-xl mb-2">Products</h1>
          <div className="flex flex-wrap gap-4">
            {includedProducts.map((product, productIndex) => {
              return (
                <SelectionProductCard
                  key={`Update Catgeory (Included Products): ${product.id} ${category.id}`}
                  product={product}
                  categoryId={category.id}
                  include={include}
                  included={true}
                  inputId={`inputId: ${product.id} ${productIndex} ${category.id}`}
                />
              );
            })}
          </div>
          {includedProducts.length > 0 &&
            (prevIncludedProducts.length > 0 || products.length > 0) && (
              <div className="bgColorGray w-3/4 h-1 rounded-full mt-1 mb-4"></div>
            )}
          {prevIncludedProducts.length > 0 && (
            <div className="flex flex-wrap gap-4">
              <h2 className="w-full">Removed</h2>
              {prevIncludedProducts.map((product, productIndex) => {
                return (
                  <SelectionProductCard
                    key={`Update Category (Previous Included Products): ${product.id} ${category.id}`}
                    product={product}
                    categoryId={category.id}
                    include={include}
                    included={false}
                    inputId={`inputId: ${product.id} ${productIndex} ${category.id}`}
                  />
                );
              })}
            </div>
          )}
          {prevIncludedProducts.length > 0 && products.length > 0 && (
            <div className="bgColorGray w-3/4 h-1 rounded-full mt-1 mb-4"></div>
          )}
          <div className="flex flex-wrap gap-4">
            {displayedProducts.length === 0 ? (
              <h1 className="w-full text-center fontColor">
                All products in this page are used <br /> Move to the
                next/previous page
              </h1>
            ) : (
              displayedProducts.map((product, productIndex) => (
                <SelectionProductCard
                  key={`Update Category (Displayed Products): ${product.node.id} ${category.id}`}
                  product={product.node}
                  include={include}
                  included={false}
                  inputId={`inputId: ${product.id} ${productIndex} ${category.id}`}
                />
              ))
            )}
          </div>
          <div className="flex items-center justify-center space-x-4 w-full">
            <button
              disabled={!hasPreviousPage ? true : isFetching}
              onClick={(e) => getOtherProducts(e, "before")}
              className={`${
                !hasPreviousPage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isFetching
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primaryColor hover:bg-secondaryColor"
              } text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
            >
              &lt;
            </button>
            <span className="textColorGray font-semibold">
              Page {productsPageNumber}
            </span>
            <button
              disabled={!hasNextPage ? true : isFetching}
              onClick={(e) => getOtherProducts(e, "after")}
              className={`${
                !hasNextPage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isFetching
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primaryColor hover:bg-secondaryColor"
              } text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminCategoriesPage = ({
  categoriesData,
  products,
  hasNextPage,
  hasPreviousPage,
}) => {
  const [productsPageNumber, setProductsPageNumber] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if (isDarkModeLocal) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    if (isFirstRender) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete("productsCursor");
      currentParams.delete("beforeOrAfter");
      const newSearchParams = currentParams.toString();
      const newPathname = `${window.location.pathname}?${newSearchParams}`;

      router.push(newPathname);
      setIsFirstRender(false);
    }
  }, []);

  const getOtherProducts = async (e, beforeOrAfter) => {
    e.preventDefault();
    if (beforeOrAfter === "after" && !hasNextPage) return;
    if (beforeOrAfter === "before" && !hasPreviousPage) return;
    setIsFetching(true);

    const currentParams = new URLSearchParams(window.location.search);
    const cursor =
      beforeOrAfter === "before"
        ? products[0].cursor
        : products[products.length - 1].cursor;
    currentParams.set("productsCursor", cursor);
    currentParams.set("beforeOrAfter", beforeOrAfter);

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;
    router.push(newPathname);

    setProductsPageNumber((prev) =>
      beforeOrAfter === "after" ? prev + 1 : prev - 1
    );
    router.refresh();
    setTimeout(function () {
      setIsFetching(false);
    }, 1000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const deleteTheCategory = async (categoryId) => {
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
          await deleteCategory(categoryId);

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
          });
        }
      }
    });
  };

  return (
    <div className="h-screen bgColor fontColor p-4 gap-6 flex flex-col overflow-y-scroll overflow-x-hidden pb-14 ">
      <button
        onClick={handleRefresh}
        className=" refreshButton border-2 duration-200 transition-colors  font-bold py-2 px-4 rounded max-h-12 self-center"
        disabled={isRefreshing} // Disable the button when refreshing
        title={isRefreshing ? "Refreshing..." : "Refresh"}
      >
        {isRefreshing ? (
          <SVGLoading className="w-6 h-6 inline " />
        ) : (
          <SVGRefresh title="Refresh" className="w-6 h-6 inline" />
        )}
      </button>
      <div className=" flex gap-4 flex-col ">
        {categoriesData.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            products={products}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            getOtherProducts={getOtherProducts}
            productsPageNumber={productsPageNumber}
            isFetching={isFetching}
            deleteTheCategory={deleteTheCategory}
          />
        ))}
      </div>
      <CreateCategoryForm
        products={products}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        getOtherProducts={getOtherProducts}
        productsPageNumber={productsPageNumber}
        isFetching={isFetching}
      />
    </div>
  );
};

export default AdminCategoriesPage;
