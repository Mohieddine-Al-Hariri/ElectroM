"use client";
import { addItemToCart, publishCart, publishItemAddedToCart, publishManyVariants } from "@/lib";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
// import { ProductCard } from ".";
import ReactStars from "react-rating-star-with-type";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useIsVisible } from "./UseVisible";
import { ImagesCarouselModal, ProductCard, SVGLoading, ScrollButton } from ".";

export function Variants({
  variant,
  setChosenProductsVariantsNames,
  isChosen,
  isOutOfStock,
  currentImageIndex,
}) {
  let isDisabled = false;
  let bg = "bg-neutral-100";
  let txtClr = "text-neutral-700";
  if (isOutOfStock || variant?.quantity === 0) {
    isDisabled = true;
    bg = "bg-gray-100";
    txtClr = "text-gray-300";
  } else if (isChosen) {
    bg = "bg-zinc-800";
    txtClr = "text-white";
    isChosen = true;
  }

  let quantity = variant?.quantity;
  if (variant?.quantity === null) quantity = "♾️"; //no limit

  return (
    <button
      disabled={isDisabled}
      onClick={() =>
        setChosenProductsVariantsNames(currentImageIndex, variant.name)
      }
      className={` ${bg} ${txtClr} w-fit h-fit p-2 flex-col justify-start items-start inline-flex rounded-full `}
    >
      <div className="text-sm font-bold leading-normal">
        {variant.name}
        {isChosen && (
          <span className="border-b-2 border-gray-300 ml-1">{quantity}</span>
        )}
      </div>
    </button>
  );
}
export function ReviewCard({ review }) {
  return (
    <div className="flex flex-col py-2 px-4 gap-2 mb-2 ">
      <div className="flex items-center gap-2 ">
        <Image
          src={review.theUser.profileImageUrl}
          alt={review.theUser.firstName}
          width={50}
          height={50}
          className="rounded-full"
        />
        <h2>
          {review.theUser.firstName} {review.theUser.lastName}
        </h2>
        <ReactStars
          count={5}
          value={review.rating}
          size={16}
          isHalf={true}
          activeColors={["red", "orange", "#FFCE00", "#FFCE00", "#4bc0d9"]}
        />
      </div>
      <h1 className="font-bold ">{review.headline}</h1>
      <p className="">{review.content}</p>
      <div className="w-3/4 h-1 bgColorGray "></div>
    </div>
  );
}
export const AddItemForm = ({
  isDarkMode,
  isOutOfStock,
  currentImageIndex,
  setCurrentImageIndex,
  collection,
  isLoggedin,
  user
}) => {
  const [chosenProductsVariantsNames, setChosenProductsVariantsNames] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [quantityLimit, setQuantityLimit] = useState(null);
  const [isItemAddedToCart, setIsItemAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  // const [showPleaseLogin, setShowPleaseLogin] = useState(false);
  const [selectVariantError, setSelectVariantError] = useState(false);
  const [isReachedLimit, setIsReachedLimit] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const router = useRouter();

  const detailsRef = useRef(null);
  const isLastOrderCardVisible = useIsVisible(detailsRef);

  const itemToCart = async () => {
    // if(!isLoggedin){
    // setShowPleaseLogin(true);
    // setTimeout(function(){
    //   setShowPleaseLogin(false);
    // }, 2000);
    //   return;
    // }
    if (collection.state !== "Available") return;
    setIsAdding(true);
    const totalPrice = quantity * collection.price; //TO DO: Add delivery cost to the Total??
    let chosenProductsVariants = [];
    let isStop = false;
    collection.products.map((product, index) => {
      if (product.productVariants.length === 0){
        setChosenProductsVariantsNames((prev) => {
          const updatedNames = [...prev];
          updatedNames[index] = product.name;
          return updatedNames;
        });
        chosenProductsVariants[index] = product.name;
      }
        // setChosenProductsVariantsNames((prev) => (prev[index] = product.name));}
      else if (product.productVariants.length === 1) {
        chosenProductsVariants[index] = product.productVariants[0].name;
        setChosenProductsVariantsNames(product.productVariants[0].name);
      } else {
        if (!chosenProductsVariantsNames[index]) {
          //To make sure a variant is chosen, add an error that the user needs to choose a variant...
          setSelectVariantError(true);
          setTimeout(function () {
            setSelectVariantError(false);
          }, 3000);
          setIsAdding(false);
          isStop = true;
          return;
        } else chosenProductsVariants[index] = chosenProductsVariantsNames[index];
      }
    });
    
    if(isStop) return;
    
    if (!isLoggedin) {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const id = uuidv4();
      const products = collection.products.map((product) => ({
        imageUrls: [{ url: product.imageUrls[0].url }],
        name: product.name,
        price: product.excerpt,
        id: product.id,
      }));

      const cartItem = {
        id,
        collectionId: collection.id,
        imageUrl: collection.imageUrl,
        quantity,
        total: totalPrice,
        isCollection: true,
        orderItemVariants: chosenProductsVariants.map((variant) => ({
          name: variant
        })),
        collection: {
          name: collection.name,
          id: collection.id,
          imageUrl: collection.imageUrl,
          products: products,
        },
      };
      const updatedCart = localCart ? [...localCart, cartItem] : [cartItem];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setIsAdding(false);
      setIsAddedToCart(true);
      setIsItemAddedToCart(true);
      setTimeout(function () {
        setIsItemAddedToCart(false);
      }, 2000);
      return;
    }
    //if user logged in, do this⬇️⬇️
    const cartId = user.cartId;
    const isAdded = await addItemToCart({
      itemId: collection.id,
      userSlug: user.slug,
      quantity,
      totalPrice,
      cartId,
      chosenProductsVariants,
      isCollection: true,
    });
    await publishCart({cartId, orderItemId: isAdded.updateCart.orderItems[0].id}); 

    setIsAdding(false);
    setIsAddedToCart(true);
    setIsItemAddedToCart(true);
    router.refresh();
    setTimeout(function () {
      setIsItemAddedToCart(false);
    }, 2000);
  };

  const increaseQuantity = () => {
    if (quantityLimit !== null && quantity + 1 > quantityLimit) {
      setIsReachedLimit(true);
      setQuantity(quantityLimit);
      setTimeout(function () {
        setIsReachedLimit(false);
      }, 2000);
      return;
    }
    setQuantity((quantity) => quantity + 1);
  };
  // Define a function to update chosenProductsVariantsNames in the parent
  const updateChosenVariants = (index, variantName) => {
    setChosenProductsVariantsNames((prev) => {
      const updatedNames = [...prev];
      updatedNames[index] = variantName;
      return updatedNames;
    });
  };

  return (
    <>
      <div className="flex flex-col w-full px-4 gap-4 ">
        {collection.products[currentImageIndex].productVariants.length > 0 && (
          <div className="left-[31px] top-[88px] text-sm font-bold leading-tight">
            Variants
          </div>
        )}
        <div className="max-sm:w-full h-fit flex flex-wrap gap-2">
          {collection.products[currentImageIndex].productVariants.map(
            (variant, index) => {
              let isChosen =
                chosenProductsVariantsNames[currentImageIndex] === variant.name;
              return (
                <Variants
                  variant={variant}
                  key={index}
                  setChosenProductsVariantsNames={updateChosenVariants}
                  isChosen={isChosen}
                  isOutOfStock={isOutOfStock}
                  currentImageIndex={currentImageIndex}
                />
              );
            }
          )}
        </div>
        <div className="flex items-center justify-center space-x-4 w-full">
          <button
            disabled= {currentImageIndex === 0}
            onClick={() => setCurrentImageIndex(prev => {
              if(prev > 0) return (prev - 1);
              else return prev
            } )}
            className={` ${currentImageIndex === 0 ? "bg-gray-400" : "bg-primaryColor hover:bg-secondaryColor"} text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
          >
            &lt;
          </button>
          <span className="textColorGray font-semibold">Item {currentImageIndex + 1}</span>
          <button
            disabled= {currentImageIndex === collection.products.length - 1}
            onClick={() => setCurrentImageIndex(prev => {
              if(prev < collection.products.length - 1) return (prev + 1);
              else return prev
            } )}
            className={`${currentImageIndex === collection.products.length - 1 ? "bg-gray-400" : "bg-primaryColor hover:bg-secondaryColor"} text-white font-bold py-2 px-4 rounded-full focus:outline-none`}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center flex-col pb-8 ">
        <div className="fontColor px-4">
          <h1 className="text-xl font-bold mb-1">{collection.name}</h1>
          <div>
            <ReactMarkdown>{collection.description}</ReactMarkdown>
          </div>
        </div>
        <div className="relative py-5 w-full flex flex-col justify-start sm:justify-between item-center text-black ">
          <div className="max-sm:w-3/4 max-sm:pl-5 flex justify-between item-center">
            <div
              className={`${
                isDarkMode ? "bg-neutral-700" : "bg-neutral-100"
              } rounded-full flex justify-between items-center gap-3 fontColor`}
            >
              <button
                onClick={() => {
                  if (quantity > 1) setQuantity(quantity - 1);
                }}
                className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
              >
                -
              </button>
              <h3 className="text-2xl">{quantity}</h3>
              <button
                onClick={increaseQuantity}
                className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
              >
                +
              </button>
            </div>
            <div>
              <div className=" fontColor text-xs font-thin leading-[14px]">
                Price
              </div>
              <div className="fontColor text-2xl font-semibold leading-7">
                ${collection.price * quantity} {/* Make it only collection.price? */}
              </div>
            </div>
          </div>
          {isReachedLimit && (
            <h1 className="text-red-500 mt-1 absolute -bottom-7">
              Chosen Variant Quantity limit reached
            </h1>
          )}
        </div>
        <div className=" w-full flex justify-center bgColor pb-4">
          <button
            ref={detailsRef}
            disabled={collection.state !== "Available"}
            onClick={itemToCart}
            className={`h-[60px] w-[263px] ${
              collection.state !== "Available"
                ? "bg-gray-300"
                : "opBgColor"
            } rounded-full justify-center items-center gap-[15px] inline-flex`}
          >
            <div className="opTxtColor text-xl font-bold leading-normal">
              {isAdding ? (
                <SVGLoading/>
              ) : (
                "Add to cart"
              )}
            </div>
          </button>
        </div>
        {isAddedToCart && (
          <div className="flex gap-2 ">
            <Link href="/" className="underline ">
              Continue Shopping
            </Link>
            Or
            <Link href={`/Cart/${user?.slug}`} className="underline ">
              Checkout
            </Link>
          </div>
        )}
        {/* {showPleaseLogin && (
        <p className="text-red-500 text-center ">
          To add item to cart, please Sign in
        </p>
      )} */}
        {selectVariantError && (
          <p className="text-primaryColor text-center ">
            Please Select Your Desired Variant for Each Product
          </p>
        )}
        {isItemAddedToCart && (
          <p className="text-green-500 text-center ">Item Added Successfuly</p>
        )}
      </div>
      <ScrollButton rotationDegree={180} isObservedElementVisible={isLastOrderCardVisible} refe={detailsRef} />
    </>
  );
};
const CollectionDetailsPage = ({ collection, user }) => {
  const [isLoggedin, setisLoggedin] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionWords = 5;
  const descriptionToShow = showFullDescription
    ? collection.products[currentImageIndex].description.replace(
        /\n/g,
        "  \n"
      ) || ""
    : collection.products[currentImageIndex].description
        .split(" ")
        .slice(0, maxDescriptionWords)
        .join(" ");

  const showMoreLessLabel = showFullDescription ? "Show Less" : "Show More";
  function checkOutOfStock() {
    let outOfStock = true;
    if (collection.products[currentImageIndex].productVariants.length > 0) {
      for (const variant of collection.products[currentImageIndex]
        .productVariants) {
        if (variant.quantity > 0 || variant.quantity === null) {
          outOfStock = false;
          break;
        }
      }
    } else outOfStock = false;
    if (collection.products[currentImageIndex].state !== "Available")
      outOfStock = true;
    return outOfStock;
  }

  useEffect(() => {
    setIsOutOfStock(checkOutOfStock());
  }, [currentImageIndex]);

  useEffect(() => {
    if (user) setisLoggedin(true);
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if (isDarkModeLocal) {
      document.body.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.body.classList.remove("dark");
      setIsDarkMode(false);
    }
    
  }, []);

    const handleToggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  // Use a useEffect hook to add/remove event listeners for touch devices
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.msMaxTouchPoints;
    const handleToggleTooltip = document.getElementById("tooltip");
    if (isTouchDevice) {
      // On touch devices, add a click event listener to show the tooltip once
      handleToggleTooltip.addEventListener("click", handleToggleTooltip, {
        once: true,
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (isTouchDevice) {
        handleToggleTooltip.removeEventListener("click", handleToggleTooltip);
      }
    };
  }, []);

  const rates = collection.products[currentImageIndex].reviews?.map(
    (review) => review.rating
  );
  const rate = rates?.reduce((a, b) => a + b, 0) / rates?.length;
  return (
    <div className=" overflow-y-scroll h-screen overflow-x-hidden flex items-start justify-center pb-10 bgColor  ">
      <div className="w-full relative bgColor fontColor max-sm:flex-col gap-6 justify-start flex-wrap items-start max-sm:inline-flex">
        {/*TODO: make scrolling keep the image in its place, and moves the content above it, and maybe make it based on desire? */}
        <div className="sm:flex sm:items-start sm:mb-10 sm:justify-center w-full ">
          
          <ImagesCarouselModal imageIndex={currentImageIndex} setImageIndex={setCurrentImageIndex} product={{imageUrls: collection.products.map(product => product.imageUrls[0])}} />
          
          <div className="flex flex-col justify-between gap-10 sm:h-screen">
            <div className="max-sm:w-full w-[440px] relative bgColor flex flex-col justify-center px-2 pl-5 gap-4">
              <div>
                <div className="left-[30px] top-[22px] text-xl font-bold mb-1">
                  {collection.products[currentImageIndex].name}
                </div>
                <div className="left-[31px] top-[54px] text-sm font-thin leading-[18px]">
                  {collection.products[currentImageIndex].excerpt ||
                    "Winter Training Full-Zip Hoodie"}
                </div>
                <div className="left-[31px] top-[54px] fontColor text-sm leading-[18px]">
                  <ReactMarkdown className="prose mt-2">
                    {descriptionToShow}
                  </ReactMarkdown>
                  {collection.products[currentImageIndex].description &&
                    collection.products[currentImageIndex].description.split(
                      " "
                    ).length > maxDescriptionWords && (
                      <span
                        className="cursor-pointer text-blue-500"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {" "}
                        {showMoreLessLabel}
                      </span>
                    )}
                </div>
              </div>

              <h1
                className={`text-xl ${
                  isOutOfStock ? "text-red-500" : "text-green-500"
                } `}
              >
                {isOutOfStock ? "Out of Stock!" : "Available"}
              </h1>
              {/* <div className="relative w-full flex flex-col justify-start sm:justify-between item-center text-black ">
                <div className="w-3/4 flex justify-between item-center">
                  <div
                    className={`${
                      isDarkMode ? "bg-neutral-700" : "bg-neutral-100"
                    } rounded-full flex justify-between items-center gap-3 fontColor`}
                  >
                    <button
                      onClick={() => {
                        if (quantity > 1 && collection.products[currentImageIndex].state === "Available")
                          setQuantity(quantity - 1);
                      }}
                      className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
                    >
                      -
                    </button>
                    <h3 className="text-2xl">{quantity}</h3>
                    <button
                      onClick={increaseQuantity}
                      className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    <div className=" fontColor text-xs font-thin leading-[14px]">
                      Price
                    </div>
                    <div className="fontColor text-2xl font-semibold leading-7">
                      ${collection.products[currentImageIndex].price}
                    </div>
                  </div>
                </div>
                {isReachedLimit && (
                  <h1 className="text-red-500 mt-1 absolute -bottom-7">
                    Chosen Variant Quantity limit reached
                  </h1>
                )}
              </div> */}
              {/* {collection.products[currentImageIndex].reviews && collection.products[currentImageIndex].reviews.length > 0 &&
                  <ReactStars
                    count={5}
                    value={rate}
                    size={16}
                    isHalf={true}
                    activeColors={[ "red", "orange", "#FFCE00", "#FFCE00","#4bc0d9",]}
                    className='absolute bottom-0 right-0'
                  />
                } */}
              <div
                id="tooltip"
                className="relative"
                onMouseEnter={handleToggleTooltip}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {collection.products[currentImageIndex].reviews &&
                  collection.products[currentImageIndex].reviews.length > 0 && (
                    <ReactStars
                      count={5}
                      value={rate}
                      size={16}
                      isHalf={true}
                      activeColors={[
                        "red",
                        "orange",
                        "#FFCE00",
                        "#FFCE00",
                        "#4bc0d9",
                      ]}
                      className="absolute bottom-0 right-0"
                    />
                  )}
                {showTooltip && (
                  <div className="tooltip">based on the last 10 reviews</div>
                )}
              </div>
            </div>
            <AddItemForm
              isLoggedin={isLoggedin}
              isOutOfStock={isOutOfStock}
              isDarkMode={isDarkMode}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              collection={collection}
              user={user}
            />
            {/* <div className="flex flex-col w-full px-4 ">
                {collection.products[currentImageIndex].productVariants.length > 0 && (
                  <div className="left-[31px] top-[88px] text-sm font-bold leading-tight mb-2">
                    Variants
                  </div>
                )}
                <div className="max-sm:w-full h-fit flex flex-wrap gap-2">
                  {collection.products[currentImageIndex].productVariants.map((variant, index) => {
                    let isChosen = chosenProductsVariantsNames[currentImageIndex] === variant.name;
                    return (
                      <Variants
                        variant={variant}
                        key={index}
                        setChosenProductsVariantsNames={
                          setChosenProductsVariantsNames
                        }
                        isChosen={isChosen}
                        isOutOfStock={isOutOfStock}
                        currentImageIndex={currentImageIndex}
                      />
                    );
                  })}
                </div>
            </div> */}
            {/* <div className="w-full text-center text-black text-3xl flex justify-center gap-3"> Total <h1 className="font-bold"> {collection.products[currentImageIndex].price*quantity}</h1>  </div> */}
            {/* <div className="w-full flex justify-center items-center flex-col pb-8 ">
              <div className="fontColor px-4">
                <h1 className="text-xl font-bold mb-1">{collection.name}</h1>
                <div>
                  <ReactMarkdown>
                    {collection.description}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="relative py-5 w-full flex flex-col justify-start sm:justify-between item-center text-black ">
                  <div className="max-sm:w-3/4 max-sm:pl-5 flex justify-between item-center">
                    <div
                      className={`${
                        isDarkMode ? "bg-neutral-700" : "bg-neutral-100"
                      } rounded-full flex justify-between items-center gap-3 fontColor`}
                    >
                      <button
                        onClick={() => {
                          if (quantity > 1)
                            setQuantity(quantity - 1);
                        }}
                        className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
                      >
                        -
                      </button>
                      <h3 className="text-2xl">{quantity}</h3>
                      <button
                        onClick={increaseQuantity}
                        className="rounded-full bgColor w-10 h-10 p-2 text-4xl flex justify-center items-center"
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <div className=" fontColor text-xs font-thin leading-[14px]">
                        Price
                      </div>
                      <div className="fontColor text-2xl font-semibold leading-7">
                        ${collection.price * quantity}
                      </div>
                    </div>
                  </div>
                  {isReachedLimit && (
                    <h1 className="text-red-500 mt-1 absolute -bottom-7">
                      Chosen Variant Quantity limit reached
                    </h1>
                  )}
                </div>
              <div className=" w-full flex justify-center bgColor pb-4">
                <button
                  disabled={isOutOfStock}
                  onClick={itemToCart}
                  className={`h-[60px] pl-[86px] pr-[89px] pt-[18px] pb-[17px] ${
                    collection.products[currentImageIndex].state !== "Available" ? "bg-gray-300" : "opBgColor"
                  } rounded-full justify-center items-start gap-[15px] inline-flex`}
                >
                  <div className="opTxtColor text-xl font-bold leading-normal">
                    {isAdding ? (
                      <SVGLoading/>
                    ) : (
                      "Add to cart"
                    )}
                  </div>
                </button>
              </div>
              {isAddedToCart && (
                <div className="flex gap-2 ">
                  <Link href="/" className="underline ">
                    Continue Shopping
                  </Link>
                  Or
                  <Link href={`/Cart/${user?.slug}`} className="underline ">
                    Checkout
                  </Link>
                </div>
              )}
              {showPleaseLogin && (
                <p className="text-red-500 text-center ">
                  To add item to cart, please Sign in
                </p>
              )}
              {selectVariantError && (
                <p className="text-primaryColor text-center ">
                  Please Select Your Desired Variant
                </p>
              )}
              {isItemAddedToCart && (
                <p className="text-green-500 text-center ">
                  Item Added Successfuly
                </p>
              )}
            </div> */}
          </div>
        </div>
        {/* Similars from same Category */}
        {collection.products[0].categories[0]?.products.length > 0 && (
          <h2 className="pl-4 ">Other Related Products</h2>
        )}
        <div className="w-full overflow-x-auto px-2 pb-2">
          {collection.products[0].categories[0]?.products.length > 0 && (
            <div className=" flex gap-3 items-center sm:justify-evenly mb-10 relative w-full pb-2 ">
              {collection.products[0].categories[0]?.products?.map((product, index) => (
                <div key={`Similar Product div: ${product.id}-${index}`} className="max-w-[300px] min-w-[200px]">
                  <ProductCard
                    key={`Similar Product: ${product.id}-${index}`}
                    id={product.id}
                    name={product.name}
                    excerpt={product.excerpt}
                    imageUrl={product.imageUrls[0].url}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {collection.products[currentImageIndex].reviews.length > 0 && (
          <div className="w-full h-1 bgColorGray "></div>
        )}
        <div>
          {collection.reviews.length > 0 && "Collection Reviews"}
          {collection.reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div>
          {collection.products[currentImageIndex].reviews.length > 0 && "Item Reviews"}
          {collection.products[currentImageIndex].reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailsPage;
