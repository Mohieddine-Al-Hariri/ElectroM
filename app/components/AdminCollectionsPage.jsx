"use client";

import { deleteCollection, publishCollection, updateCollection, updateCollectionState } from "@/lib";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useRef } from "react";
import Image from "next/image";
import CreateCollectionForm from "./CreateCollectionForm";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import { v4 } from "uuid";
import { SVGCancel, SVGCheck, SVGDefault, SVGLoading, SVGPencil, SVGRefresh, SVGTrash, SVGX, SelectionProductCard } from ".";
import Swal from "sweetalert2";

export const CollectionStateMenu = ({
  collectionState,
  setCollectionState,
  collectionId,
  isOpen,
  setIsOpen,
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

  const updateCollectionShowState = async (newState) => {
    const updatedCollection = await updateCollectionState({
      collectionId,
      state: newState,
    });
    setCollectionState(newState);
    //publishOrderItems && publishTheUser??
    setIsOpen(false);
    await publishCollection(collectionId);
    router.refresh();
  };
  return (
    <div
      ref={cardMenuRef}
      className={`absolute w-48 h-10 bgColorGray fontColor rounded-t-md right-2 -top-2 pt-1 pr-1 `}
    >
      <div>
        <div className="w-full flex justify-end">
          <button
            className="p-1 fontColorGray hover:text-gray-100 hover:bg-[#4bc0d9] rounded-full focus:outline-none"
            onClick={() => setIsOpen(!isOpen)} title="Close" 
          >
            <SVGX />
          </button>
        </div>

        <div className="absolute right-0 w-48 fontColor rounded-md shadow-lg z-10 bgColorGray">
          <ul>
            {states.map((state) => {
              return (
                <button
                  key={state}
                  disabled={state === collectionState}
                  onClick={() => updateCollectionShowState(state)}
                  className={`px-4 py-2 rounded-md hover:bg-[#4bc0d9] ${state === collectionState ? "text-whiter" : " fontColor "} hover:text-white flex w-full justify-between `}
                >
                  {state}
                  {/* {svg} */}
                </button>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const CollectionCard = ({
  collection,
  products,
  deletePrevImage,
  uploadImage,
  getOtherProducts,
  productsPageNumber,
  hasNextPage,
  hasPreviousPage,
  isFetching,
  index,
  deleteACollection,
}) => {
  const [show, setShow] = useState(collection.show);
  const [collectionName, setCollectionName] = useState(collection.name);
  const [updatingCollectionName, setUpdatingCollectionName] = useState(false);
  const [description, setDescription] = useState(collection.description || "");
  const [openMenu, setOpenMenu] = useState(false);
  const [collectionState, setCollectionState] = useState(collection.state);
  const [includedProducts, setIncludedProducts] = useState([]);
  const [prevIncludedProducts, setPrevIncludedProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(collection.imageUrl || "");
  const [numericPrice, setNumericPrice] = useState(collection.price || null);
  const [price, setPrice] = useState(collection.price);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isError, setIsError] = useState(false);

  let stateTxtClr = "text-green-500";
  if (collection.state === "Removed") stateTxtClr = "text-red-500";
  else if (collection.state === "Out_of_Stock") stateTxtClr = "text-yellow-500";

  const router = useRouter();

  useEffect(() => {
    setIncludedProducts(
      collection.products.map((product) => (
        {id: product.id, imageUrls: product.imageUrls, name: product.name}
      ))
    );
  }, [updatingCollectionName]);

  const updateDisplayedProducts = () => {
    const filteredProducts = products.map((product) => {
      // Initialize a flag to check if the product is included
      let isIncluded = false;
      // Check if the product is in the includedProducts array
      for (const includedProduct of includedProducts) {
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
    }).filter((item) => item !== null)
    setDisplayedProducts(filteredProducts);
  }
  useEffect(() => {
    updateDisplayedProducts();
  }, [products]);

  const include = (isIncluded, product) => {
    // Check if the product should be included
    if (isIncluded) {
      // Remove from the includedProducts collection
      setIncludedProducts((prevIncluded) =>
        prevIncluded.filter((item) => item.id !== product.id)
      );
      
      // Check if the product was previously in the collection
      const isInPrev = collection.products.some((item) => item.id === product.id);
  
      // Add to prevIncluded, only if it was connected to the collection previously in DB
      // else, Add to displayedProducts
      isInPrev 
        ? setPrevIncludedProducts((prevIncluded) =>[...prevIncluded, product]) 
        : setDisplayedProducts((prevDisplayed) => [...prevDisplayed, {node: product}]);;
      
      // No need to update displayedProducts in this case
      return;
    }
    
    // Add to the includedProducts collection
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
  
  
  const handlePriceChange = (e) => {
    const newValue = e.target.value;
    setPrice(newValue);
  
    // Check if the input can be parsed as a number, and update numericPrice accordingly.
    const parsedValue = parseFloat(newValue.replace('$', '').trim());
    setNumericPrice(isNaN(parsedValue) ? null : parsedValue);
  };

  const updateCollectionDetails = async () => {
    // Check if required data is available; if not, return and do nothing
    if (!numericPrice || !collectionName) return;
  
    // Set the updating flag to indicate that the update is in progress
    setIsUpdating(true);
    setIsError(false);
  
    // If an image is being uploaded and the collection has an existing image, delete the previous image
    if (imageUpload && collection.imageUrl) {
      try {
        await deletePrevImage(collection.imageUrl);
      } catch (error) {
        // Handle errors related to image deletion (e.g., display an error message)
        console.error('Error deleting previous image:', error);
        // You can set an error flag or show an error message to the user as needed
      }
    }
  
    let uploadedImageUrl = imageUrl; // Initialize with the existing image URL
  
    // If a new image is being uploaded, update the image URL
    if (imageUpload) {
      try {
        uploadedImageUrl = await uploadImage(imageUpload, imageUrl, collection.name);
      } catch (error) {
        // Handle errors related to image uploading (e.g., display an error message)
        console.error('Error uploading image:', error);
        // You can set an error flag or show an error message to the user as needed
      }
    }
  
    // Calculate the list of products to include in the collection update
    const productIdsInCollection = new Set(collection.products.map((product) => product.id));
    const productsToInclude = includedProducts
      .filter((product) => !productIdsInCollection.has(product.id))
      .map((product) => ({ where: { id: product.id } }));
  
    try {
      // Perform the collection update
      const updatedCollection = await updateCollection({
        id: collection.id,
        name: collectionName,
        state: collectionState,
        description,
        products: productsToInclude,
        prevProducts: prevIncludedProducts.map((product) => ({ id: product.id })),
        imageUrl: uploadedImageUrl,
        price: numericPrice,
      });
  
      // Publish the updated collection
      await publishCollection(collection.id);
  
      // Clear included and previous products, and refresh the router
      setIncludedProducts([]);
      setPrevIncludedProducts([]);
      router.refresh();
  
      // Reset the updating flag
      setUpdatingCollectionName(false);
    } catch (error) {
      // Handle errors that occur during collection update or publication (e.g., display an error message)
      setIsError(true);
      console.error('Collection update failed:', error);
      // You can set an error flag or show an error message to the user as needed
    } finally {
      // Reset the updating flag
      setIsUpdating(false);
    }
  };

  const handleChangeImage = (e) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");

      return;
    }
    setImageUpload(file);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result;

      // handleStateChange("image", result)
      setImageUrl(result);
    };
  };

  const deleteCollectionFunc = async () => { 

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      iconColor: "#4bc0d9",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: "staticBgColor fontColorGray"      
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDeleting(true);
          if(collection.imageUrl) await deletePrevImage(collection.imageUrl);
          await deleteACollection(collection.id);
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            customClass: "staticBgColor fontColorGray",
            iconColor: "#4bc0d9",
            confirmButtonColor: '#4bc0d9',
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<p >Please try again</p>'
          })
          setIsDeleting(false);  
        }
      }
    })
  };

  const resetCollectionDetailsFunc = () => {
    updateDisplayedProducts();
    setCollectionName(collection.name);
    // setCollectionState(collection.state);
    setDescription(collection.description);
    setImageUrl(collection.imageUrl);
    setImageUpload(null);
    setNumericPrice(collection.price);
    // setIncludedProducts([]);
    setPrevIncludedProducts([]);
    setIsDeleting(false);
    setIsUpdating(false);
    // setUpdatingCollectionName(false);
    // setShow(collection.show);
    setPrice(collection.price);

  };
    
  return (
    <div
      className={`border-2 ${
        show ? "borderColor fontColor" : "border-gray-500 fontColorGray"
      } rounded-lg p-2 w-full max-[1400px]:max-w-[730px] min-[1400px]:w-[730px] grow`}
    >
      <div
        className={` p-2 flex max-sm:flex-col-reverse ${
          updatingCollectionName && "mb-8"
        } justify-between sm:flex-wrap max-sm:gap-4`}
      >
        {!updatingCollectionName && collection.imageUrl && (
          <div className="max-sm:flex  items-center justify-center ">
            <div className="flex items-center relative rounded-lg overflow-hidden w-[100px] h-[100px]">
              <Image
                src={collection.imageUrl}
                alt={collection.name}
                fill
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        {updatingCollectionName && (
          <div className="flexCenter flex-col lg:min-h-[200px] min-h-[100px] relative w-full py-16">
            {!imageUpload && (
              <label
                htmlFor="poster"
                className="flexCenter z-10 text-center w-full h-[300px] p-20 dashedBorder rounded-lg aspect-square fontColor absolute"
              >
                Choose an Image <br /> (optional)
              </label>
            )}
            <div className="flexCenter bg-gray-500 rounded-lg aspect-square overflow-hidden w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-[200px] ">
              <input
                id="image"
                type="file"
                accept="image/*"
                className="form_image-input "
                onChange={(e) => handleChangeImage(e)}
              /> 
              {imageUrl && (
                <Image
                  src={imageUrl}
                  className=" object-cover z-20 w-full h-full rounded-lg "
                  alt="image"
                  // fill
                  width={1000}
                  height={1000}
                />
              )}
            </div>
            {imageUpload?.name.slice(0, 20)}...
          </div>
        )}
        <div className="sm:w-2/3  ">
          {updatingCollectionName ? (
            <div className="flex flex-col justify-around items-start w-full h-full max-sm:gap-2 ">
              <label htmlFor="collectionName" className="w-full">
                <h1>Name</h1>
                <input
                  type="text"
                  id="collectionName"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="rounded-md border-2 p-2 borderColor colorScheme"
                />
              </label>
              <label htmlFor="collectionDescription" className="w-full">
                <h1>Description</h1>
                <input
                  id="collectionDescription"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-md border-2 p-2 borderColor colorScheme w-full"
                />
              </label>
              <div className="flex flex-col w-[100px] colorScheme">
                <label htmlFor="price" className="text-sm font-medium">Price</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={`$${numericPrice !== null ? numericPrice : ''}`}
                  onChange={handlePriceChange}
                  className="border rounded-lg py-2 px-3"
                />
              </div>
              {isError && <p className="text-red-500 mt-2">Something went wrong, please try again </p>}
            </div>
          ) : (
            <div>
              <h1 className="text-xl font-bold">{collection.name}</h1>
              <h2>{collection.description}</h2>
              <h2>Price: ${collection.price}</h2>
            </div>
          )}
        </div>
        <div
          className={`flex gap-4 items-start sm:flex-col ${
            updatingCollectionName
              ? " items-center"
              : "w-full sm:w-fit justify-center"
          }`}
        >
          {updatingCollectionName ? (
            <button
              className="flex w-full justify-center sm:justify-between hover:text-[#4bc0d9] max-sm:flex-col items-center sm:gap-2"
              onClick={updateCollectionDetails}
            >
              <span className="text-md">{isUpdating ? "Submitting..." : "Submit"}</span>
              {isUpdating ? <SVGLoading/> : <SVGCheck/>}
            </button>
          ) : (
            <button className="hover:text-[#4bc0d9]" onClick={() => setUpdatingCollectionName(true)}>
              <SVGPencil/>
            </button>
          )}
          {openMenu ? (
            <div className="mb-4 relative">
              <CollectionStateMenu
                collectionState={collectionState}
                setCollectionState={setCollectionState}
                collectionId={collection.id}
                isOpen={openMenu}
                setIsOpen={setOpenMenu}
              />
              <button
                onClick={() => setOpenMenu(true)}
                className="border-2 border-gray-500 rounded-full px-3 py-1 "
              >
                <h1 className={`${stateTxtClr} font-bold`}>
                  {collectionState}
                </h1>
              </button>
            </div>
          ) : (
            <div className="sm:flex sm:justify-between items-center gap-2">
              {updatingCollectionName && <h2 className="text-center">State</h2>}
              <button
                onClick={() => setOpenMenu(true)}
                className="border-2 border-gray-500 hover:border-[#4bc0d9] rounded-full px-3 py-1 "
              >
                <h1 className={`${stateTxtClr} font-bold`}>
                  {collectionState}
                </h1>
              </button>
            </div>
          )}

          {!updatingCollectionName ? (
            <button className="hover:text-red-500" disabled={isDeleting} onClick={deleteCollectionFunc}>
              {!isDeleting ? (
                <SVGTrash width="30px" height="30px" />
              ) : (
                <SVGLoading/>
              )}
            </button>
          ) : (
            <>
              <button
                className="flex w-full max-sm:flex-col items-center justify-center sm:justify-between sm:gap-2 hover:text-yellow-500"
                onClick={() => setUpdatingCollectionName(false)}
              >
                Cancel
                <SVGCancel width="30px" height="30px" />
              </button>
              <button
                className="flex w-full max-sm:flex-col items-center justify-center sm:justify-between sm:gap-2 hover:text-[#4bc0d9]"
                onClick={resetCollectionDetailsFunc}
              >
                Default
                <SVGDefault/>
              </button>
            </>
          )}
        </div>
      </div>
      {updatingCollectionName && (
        <div className="flex flex-col gap-3 mt-3">
          <h1 className="text-xl mb-2">Products</h1>
          <div className="flex flex-wrap gap-4">
            {includedProducts.map((product, productIndex) => {
              return (
                <SelectionProductCard
                  key={`Update Collection (Included Products): ${product.id} ${index} ${collection.id}`}
                  product={product}
                  collectionId={collection.id}
                  include={include}
                  included={true}
                  inputId={`inputId: ${product.id} ${productIndex} ${collection.id}`}
                />
              );
            })}
          </div>
          {(includedProducts.length > 0 && (prevIncludedProducts.length > 0 || products.length > 0)) && <div className="bgColorGray w-3/4 h-1 rounded-full mt-1 mb-4"></div>}
          {prevIncludedProducts.length > 0 && <div className="flex flex-wrap gap-4">
            <h2 className="w-full">Removed</h2>
            {prevIncludedProducts.map((product, productIndex) => {
              return (
                <SelectionProductCard
                  key={`Update Collection (Previous Included Products): ${product.id} ${index} ${collection.id}`}
                  product={product}
                  collectionId={collection.id}
                  include={include}
                  included={false}
                  inputId={`inputId: ${product.id} ${productIndex} ${collection.id}`}
                />
              );
            })}
          </div>}
          {(prevIncludedProducts.length > 0 && products.length > 0) && <div className="bgColorGray w-3/4 h-1 rounded-full mt-1 mb-4"></div>}
          <div className="flex flex-wrap gap-4">
            {
              displayedProducts.length === 0 ? 
                <h1 className="w-full text-center fontColor">All products in this page are used <br /> Move to the next/previous page</h1>
              :
                displayedProducts.map((product, productIndex) => (
                  <SelectionProductCard
                    key={`Update Collection (Displayed Products): ${product.node.id} ${index} ${collection.id}`}
                    product={product.node}
                    include={include}
                    included={false}
                    inputId={`inputId: ${product.id} ${productIndex} ${collection.id}`}
                  />
                ))
            }

          </div>
          <div className="flex items-center justify-center space-x-4 w-full">
            <button
              disabled={!hasPreviousPage ? true : isFetching }
              onClick={(e) => getOtherProducts(e, "before")}
              className={`${
                !hasPreviousPage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isFetching ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#4bc0d9] hover:bg-[#3ca8d0]"
              } text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
            >
              &lt;
            </button>
            <span className="textColorGray font-semibold">Page {productsPageNumber}</span>
            <button
              disabled={!hasNextPage ? true : isFetching }
              onClick={(e) => getOtherProducts(e, "after")}
              className={`${
                !hasNextPage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isFetching ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#4bc0d9] hover:bg-[#3ca8d0]"
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

const AdminCollectionsPage = ({
  collectionsData,
  productsData,
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
    if(isFirstRender){
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.delete("productsCursor");
      currentParams.delete("beforeOrAfter");
      const newSearchParams = currentParams.toString();
      const newPathname = `${window.location.pathname}?${newSearchParams}`;
      
      router.push(newPathname);  
      setIsFirstRender(false)
    }
  }, []);
  const deletePrevImage = async (prevImgUrl) => {
    //To remove the old profile Image from the database
    try {
      const imageRef = ref(storage, prevImgUrl);
      await deleteObject(imageRef).catch((error) => {
        console.log(error.message);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const uploadImage = async (imagePath, givenImageUrl, collectionName) => {
    //To add the new profile image to the database
    if (imagePath == null || !imagePath) {
      return givenImageUrl;
    }
    const imageRef = ref(storage, `collections/${collectionName}/${imagePath.name + v4()}`);
    const imageUrl = await uploadBytes(imageRef, imagePath).then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(snapshot.ref).then((url) => {
          return url;
        });
        return downloadUrl;
      }
    );
    return imageUrl;
  };
  const getOtherProducts = async (e, beforeOrAfter) => {
    //Paginate to the next/previous page
    e.preventDefault();
    if(beforeOrAfter === "after" && !hasNextPage) return;
    if(beforeOrAfter === "before" && !hasPreviousPage) return;
    setIsFetching(true);
    

    const currentParams = new URLSearchParams(window.location.search);
    const cursor = beforeOrAfter === "before" ? productsData[0].cursor : productsData[productsData.length - 1].cursor;
    currentParams.set("productsCursor", cursor);
    currentParams.set("beforeOrAfter", beforeOrAfter);

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;
    router.push(newPathname);

    setProductsPageNumber(prev => beforeOrAfter === "after" ? prev + 1 : prev - 1);
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

  const deleteACollection = async (collectionId) => {
    await deleteCollection(collectionId);
    router.refresh();
  }

  return (
    <div className="h-full bgColor fontColor p-4 gap-6 flex flex-col overflow-y-scroll overflow-x-hidden pb-14 ">
      <button
        onClick={handleRefresh}
        className=" hover:bg-white hover:text-black border-white border-2 duration-75 text-white font-bold py-2 px-4 rounded max-h-12 self-center"
        disabled={isRefreshing} // Disable the button when refreshing
        title={isRefreshing ? "Refreshing..." : "Refresh"}
      >
        {isRefreshing ? (
          <SVGLoading className="w-6 h-6 inline " />
        ) : (
          <SVGRefresh title="Refresh" className="w-6 h-6 inline" />
        )}
      </button>
      <div className=" flex gap-4 max-[1400px]:flex-col items-center flex-wrap">
        {collectionsData.map((collection, index) => (
          <CollectionCard
            key={`${index}: ${collection.node.id}`}
            collection={collection.node}
            products={productsData}
            deletePrevImage={deletePrevImage}
            uploadImage={uploadImage}
            getOtherProducts={getOtherProducts}
            productsPageNumber={productsPageNumber}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            isFetching={isFetching}
            deleteACollection={deleteACollection}
            index={index}
          />
        ))}
      </div>
      <CreateCollectionForm
        products={productsData}
        getOtherProducts={getOtherProducts}
        productsPageNumber={productsPageNumber}
        setProductsPageNumber={setProductsPageNumber}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        isFetching={isFetching}
        uploadImage={uploadImage}
      />
    </div>
  );
};

export default AdminCollectionsPage;
