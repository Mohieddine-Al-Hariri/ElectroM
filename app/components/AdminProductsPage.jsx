"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsVisible } from "./UseVisible";

import CreateProductForm from "./CreateProductForm";
import {
  AdminProductCard,
  FilterSelect,
  SVGLoading,
  SVGRefresh,
  SVGTrash,
  ScrollButton,
} from ".";
import SearchBar from "./SearchBar";

import {
  deleteManyProducts,
  deleteProduct,
  getProducts,
  publishManyOrders,
  publishOrder,
} from "@/lib";

import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

export const LoadingCard = () => {
  return (
    <div className="flex relative w-full lg:w-1/3 grow justify-between items-center rounded-md shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] productCardBg fontColor p-2 duration-200 bg-gray-200 animate-pulse">
      <div className="rounded-t-md bg-white w-[102px] h-[109.03px] "></div>
      <div className="absolute bottom-0 left-0 px-4 py-2 w-full">
        <h1 className=" bg-white rounded-full w-1/2 h-4 mb-2"></h1>
        <h1 className=" bg-white rounded-full w-3/4 h-4"></h1>
      </div>
    </div>
  );
};

const AdminProductsPage = ({
  products,
  hasNextPage,
  searchText,
  categoriesData,
  searchedCategory,
  collectionsData,
  searchedCollection,
}) => {
  const [productsState, setProductsState] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const [lastProductCursor, setLastProductCursor] = useState(
    products[products.length - 1]?.cursor
  );
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [doesHaveNextPage, setDoesHaveNextPage] = useState(hasNextPage);

  const lastProductCardRef = useRef();
  const isLastProductCardVisible = useIsVisible(lastProductCardRef);
  const [resetSearchText, setResetSearchText] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); //for loading while awaiting deleting products

  const [deletedProductId, setDeletedProductId] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();

  const topRef = useRef(null);
  const isTopButtonVisible = useIsVisible(topRef);


  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if (isDarkModeLocal) {
      document.body.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.body.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProducts.length >= productsState.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedProducts, productsState]);

  const getMoreProducts = async () => {
    const isSearchedCategory = searchedCategory || undefined;
    const isSearchedCollection = searchedCollection || undefined;
    const paginatedProducts = await getProducts(
      lastProductCursor,
      searchText,
      isSearchedCategory,
      isSearchedCollection,
      true
    );
    return paginatedProducts;
  };
  useEffect(() => {
    //TODO: Create a env var specific for this pagination, make the key limited to reading products only
    if (isFirstRender) {
      setIsFirstRender(false);
    } else if (doesHaveNextPage && !isLoading) {
      setIsLoading(true);
      getMoreProducts().then((result) => {
        result.pageInfo.hasNextPage &&
          setLastProductCursor(
            result.products[result.products.length - 1].cursor
          );
        setDoesHaveNextPage(result.pageInfo.hasNextPage);
        setProductsState([...productsState, ...result.products]);
        setIsFirstRender(true);
        setIsLoading(false);
        setIsSelectAll(false);
      });
    }
  }, [isLastProductCardVisible]);

  useEffect(() => {
    setProductsState(() => {
      //Removes Deleted Product From State
      const updatedProducts = deletedProductId
        ? [
            ...products.filter(
              (product) => product.node.id !== deletedProductId
            ),
          ]
        : products;
      return updatedProducts;
    });
    setDoesHaveNextPage(hasNextPage);
  }, [products, hasNextPage]);

  const deleteProductImages = async (imageUrls) => {
    // Delete images from firebase
    try {
      // Create an array of promises for deleting each image
      const deletePromises = imageUrls.map((imageUrl) => {
        const imageRef = ref(storage, imageUrl);
        return deleteObject(imageRef);
      });

      // Use Promise.all() to delete all images concurrently
      await Promise.all(deletePromises);
    } catch (error) {
      console.log("Error deleting product images:", error.message);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const deleteProductFromDb = async (
    productId,
    imageUrls,
    orderItemsIds,
    reviewsIds,
    ordersIds
  ) => {
    setIsDeleting(true);
    imageUrls?.length > 0 && (await deleteProductImages(imageUrls));
    const deletedProduct = await deleteProduct({
      productId,
      imageUrls,
      orderItemsIds,
      reviewsIds,
    });
    await publishManyOrders(ordersIds.map((order) => order.order.id));
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );

    router.refresh();
    setDeletedProductId(deletedProduct.id);
    setIsDeleting(false);
  };
  const deleteManyProductsFromDb = async () => {
    if (selectedProducts.length === 0) return;

    const availableIds = productsState.map((product) => product.node.id);
    const selectedProductsFiltered = selectedProducts.filter((product) =>
      availableIds.includes(product.id)
    );
    if (selectedProductsFiltered.length === 0) {
      setSelectedProducts([]);
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `All ${selectedProducts.length} selected items will be deleted permenantaly!`,
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
          const imageUrls = selectedProductsFiltered
            .map((product) => product.imageUrls.map((imageUrl) => imageUrl.url))
            .flat();

          setIsDeleting(true);
          imageUrls?.length > 0 && (await deleteProductImages(imageUrls));

          const productsIds = selectedProductsFiltered.map(
            (product) => product.id
          );
          const orderItemsIds = selectedProductsFiltered
            .map((product) =>
              product.orderItems.map((orderItem) => orderItem.id)
            )
            .flat();
          const reviewsIds = selectedProductsFiltered
            .map((product) => product.reviews.map((review) => review.id))
            .flat();
          const ordersIds = selectedProductsFiltered
            .map((product) =>
              product.orderItems.map((orderItem) => orderItem?.order?.id)
            )
            .flat()
            .filter((id) => id !== undefined);

          const deletedProduct = await deleteManyProducts({
            productsIds,
            imageUrls,
            orderItemsIds,
            reviewsIds,
            ordersIds,
          });
          await publishManyOrders(ordersIds);
          setIsDeleting(false);
          router.refresh();
          toast.success(
            `${
              selectedProducts.length === 1 ? "Item was" : "Items where"
            } deleted succefully. \nIf you can still see them, try refreshing the page.`,
            {
              duration: 5000,
              icon: <SVGTrash className="text-[#4bc0d9]  w-[32px]" />,
            }
          );
          router.refresh();
          setDeletedProductId(deletedProduct.id);
          setIsDeleting(false);
        } catch (error) {
          toast.error(`Something went wrong, please try again.`, {
            duration: 4000,
          });
          console.log(error);
          setIsDeleting(false);
        }
      }
    });

    //setDeletedProductIds([...deletedProductIds, deletedProduct.id]);???????
  };

  const selectAll = () => {
    if (selectedProducts.length >= productsState.length) {
      setSelectedProducts([]);
      setIsSelectAll(false);
    } else {
      // setSelectedProducts(productsState.map((product) => product.node.id));
      setSelectedProducts(productsState.map((product) => product.node));
      setIsSelectAll(true);
    }
  };

  return (
    <div className="overflow-y-scroll h-full bgColor fontColor lg:pb-4 max-sm:pb-10 ">
      <Toaster />

      <div ref={topRef} className="p-2 ">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="border-2 borderColor rounded-lg p-2 fontColor w-full hover:border-[#4bc0d9] hover:bg-[#4bc0d9] hover:text-white "
        >
          {isCreating ? "Products" : "Create"}
        </button>
      </div>
      {isCreating ? (
        <CreateProductForm
          categoriesData={categoriesData}
          isDarkMode={isDarkMode}
          collectionsData={collectionsData}
        />
      ) : (
        <div className="flex flex-col gap-2 p-1 bgColor ">
          <div className="lg:flex lg:justify-center lg:items-end lg:mb-4 gap-2">
            <SearchBar resetSearchText={resetSearchText} />
            <div className="flex gap-2 justify-center lg:items-end max-[500px]:flex-col ">
              <FilterSelect
                options={categoriesData}
                searchedSelection={searchedCategory}
                filterBy="Category"
                setResetSearchText={setResetSearchText}
              />
              <FilterSelect
                options={collectionsData}
                searchedSelection={searchedCollection}
                filterBy="Collection"
                setResetSearchText={setResetSearchText}
              />
              <button
                onClick={handleRefresh}
                className=" hover:bg-white hover:text-black border-white border-2 duration-200 transition-colors text-white font-bold py-2 px-4 rounded"
                disabled={isRefreshing} // Disable the button when refreshing
                title={isRefreshing ? "Refreshing..." : "Refresh"}
              >
                {isRefreshing ? (
                  <SVGLoading className="w-6 h-6 inline " />
                ) : (
                  <SVGRefresh title="Refresh" className="w-6 h-6 inline " />
                )}
              </button>
              <div
                // TODO: FIX design
                className={`relative ${
                  isSelectAll
                    ? "border-[#4bc0d9]"
                    : "border-gray-300 hover:border-[#4bc0d9]"
                }  transition duration-300 p-1 pb-0 text-xl font-semibold opBorderColor min-[500px]:flex-col min-[640px]:justify-between min-[500px]:justify-start min-[500px]:gap-4 flex max-[500px]:gap-4 `}
                // htmlFor="selectAll Orders"
              >
                <div>Select All</div>
                <div className="flex justify-around min-[500px]:w-full max-[500px]:gap-2 items-center">
                  <input
                    className="w-5 h-5 cursor-pointer "
                    type="checkbox"
                    id="selectAll Orders"
                    name="selectAll Orders"
                    onChange={selectAll}
                    checked={isSelectAll}
                  />
                  {isDeleting ? (
                    <SVGLoading className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#4bc0d9]" />
                  ) : selectedProducts.length > 0 ? (
                    <button
                      className=" border-b-2"
                      onClick={deleteManyProductsFromDb}
                    >
                      <SVGTrash title="Delete Selected Products" />
                    </button>
                  ) : (
                    <button
                      disabled={true}
                      className="text-white/50 border-b-2"
                    >
                      <SVGTrash title="Select a product or more to delete" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex lg:flex-wrap max-lg:flex-col gap-2 bgColor ">
            {productsState.map(({ node }, index) => (
              <AdminProductCard
                key={`${node.id}-${index}`}
                product={node}
                hasNextPage={hasNextPage}
                deleteProductFromDb={deleteProductFromDb}
                isSelectAll={isSelectAll}
                selectedProductsIds={
                  selectedProducts.length > 0
                    ? selectedProducts.map((product) => product.id)
                    : []
                }
                setSelectedProducts={setSelectedProducts}
                index={index}
                // categories={categoriesData}
              />
            ))}
          </div>
          {/* Pagination controls */}
          {isLoading && <LoadingCard />}
          {/* An invisible element to act as the previousPostCardRef */}
          {!doesHaveNextPage && (
            <div className="flex relative h-40 w-full backGround fontColor text-2xl justify-center items-center rounded-lg ">
              All Done!{" "}
            </div>
          )}
        </div>
      )}
      <ScrollButton
        rotationDegree={0}
        refe={topRef}
        isObservedElementVisible={isTopButtonVisible}
        bgColor="bg-[#4bc0d9]"
        textColor="text-white"
      />
      <div ref={lastProductCardRef} style={{ visibility: "hidden" }} />
      <div className="max-sm:h-10 "></div>
    </div>
  );
};

export default AdminProductsPage;
