"use client";
import { addItemToCart, publishCart, publishItemAddedToCart, publishManyVariants } from "@/lib";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel styles
import { ImagesCarouselModal, ProductCard, SVGLoading, ScrollButton } from ".";
import ReactStars from "react-rating-star-with-type";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { useIsVisible } from "./UseVisible";

export function Variants({
  variant,
  setChosenProductVariantName,
  isChosen,
  isOutOfStock,
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
      onClick={() => setChosenProductVariantName(variant.name)}
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

const ItemsDetailsPage = ({ product, user }) => {
  const [chosenProductVariantName, setChosenProductVariantName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [quantityLimit, setQuantityLimit] = useState(null);
  const [isItemAddedToCart, setIsItemAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoggedin, setisLoggedin] = useState(false);
  const [showPleaseLogin, setShowPleaseLogin] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [selectVariantError, setSelectVariantError] = useState(false);
  const [isReachedLimit, setIsReachedLimit] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const detailsRef = useRef(null);
  const isLastOrderCardVisible = useIsVisible(detailsRef);


  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionWords = 5;
  const descriptionToShow = showFullDescription
    ? product.description.replace(/\n/g, "  \n") || ""
    : product.description.split(" ").slice(0, maxDescriptionWords).join(" ");

  const showMoreLessLabel = showFullDescription ? "Show Less" : "Show More";
  function checkOutOfStock() {
    let outOfStock = true;
    if (product.productVariants.length > 0){
      for (const variant of product.productVariants) {
        if (variant.quantity > 0 || variant.quantity === null) {
          outOfStock = false;
          break;
        }
      }
    } else outOfStock = false;
    if (product.state !== "Available") outOfStock = true;
    return outOfStock;
  }

  const router = useRouter();

  useEffect(() => {
    setIsOutOfStock(checkOutOfStock());
    if (user) setisLoggedin(true);
  }, []);
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
    let limit = null;
    product.productVariants.map((variant) => {
      if (variant.name === chosenProductVariantName) limit = variant.quantity;
    });
    setQuantityLimit(limit);
    if (limit && quantity > limit) {
      setQuantity(limit);
      setIsReachedLimit(true);
      setTimeout(function () {
        setIsReachedLimit(false);
      }, 2000);
    }
  }, [chosenProductVariantName]);

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

  const itemToCart = async () => {
    // if(!isLoggedin){
    // setShowPleaseLogin(true);
    // setTimeout(function(){
    //   setShowPleaseLogin(false);
    // }, 2000);
    //   return;
    // }
    if (product.state !== "Available") return;
    setIsAdding(true);
    const totalPrice = quantity * product.price;
    let chosenProductVariant = "";
    if (product.productVariants.length === 0)
      setChosenProductVariantName(product.name);
    else if (product.productVariants.length === 1) {
      chosenProductVariant = product.productVariants[0].name;
      setChosenProductVariantName(product.productVariants[0].name);
    } else {
      if (!chosenProductVariantName) {
        //To make sure a variant is chosen
        //Add an error that the user needs to choose a variant...
        //Or, change this to chose the first (available) variant automatically
        // chosenProductVariant = product.productVariants[0]?.name;
        // setChosenProductVariantName(product.productVariants[0]?.name);
        setSelectVariantError(true);
        setTimeout(function () {
          setSelectVariantError(false);
        }, 3000);
        setIsAdding(false);
        return;
      } else chosenProductVariant = chosenProductVariantName;
    }
    if (!isLoggedin) {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const id = uuidv4();
      const cartItem = {
        id,
        quantity,
        total: totalPrice,
        orderItemVariants: [{name: chosenProductVariant}],
        product: {
          imageUrls: [{ url: product.imageUrls[0].url }],
          name: product.name,
          price: product.excerpt,
          id: product.id
        }
      }
      const updatedCart = localCart
        ? [...localCart, cartItem ]
        : [cartItem];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setIsAdding(false);
      setIsAddedToCart(true);
      setIsItemAddedToCart(true);
      setTimeout(function () {
        setIsItemAddedToCart(false);
      }, 2000);
      return
    }

    //if user logged in, do this⬇️⬇️ 
    const cartId = user.cartId;
    const isAdded = await addItemToCart({
      itemId: product.id,
      userSlug: user.slug,
      quantity,
      totalPrice,
      cartId,
      chosenProductsVariants: [chosenProductVariant],
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

  const rates = product.reviews?.map((review) => review.rating);
  const rate = rates?.reduce((a, b) => a + b, 0) / rates?.length;

  return ( 
    <div className=" overflow-hidden h-full flex items-start lg:items-center justify-center px-2 bgColor  ">
      <div className=" overflow-y-scroll overflow-x-hidden w-full h-full max-sm:pb-8 relative bgColor fontColor flex-col gap-6 max-sm:gap-4 justify-start flex-wrap items-start">
        <div className="sm:flex sm:items-start sm:mb-10 sm:justify-center w-full h-fit">
          {/* TODO: Make the image size based on the used images dimensions */}
          <ImagesCarouselModal product={product} imageIndex={currentImageIndex} setImageIndex={setCurrentImageIndex} />
          <div className="flex flex-col gap-10 sm:h-full">
            <div className="max-sm:w-full w-[440px] relative bgColor flex flex-col justify-center px-2 pl-5 gap-4">
              <div>
                <div className="left-[30px] top-[22px] text-xl font-bold mb-1">
                  {product.name}
                </div>
                <div className="left-[31px] top-[54px] text-sm font-thin leading-[18px]">
                  {product.excerpt || ""}
                </div>
                <div className="left-[31px] top-[54px] fontColor text-sm leading-[18px]">
                  <ReactMarkdown className="prose mt-2">
                    {descriptionToShow}
                  </ReactMarkdown>
                  {product.description &&
                    product.description.split(" ").length >
                      maxDescriptionWords && (
                      <div
                        className="cursor-pointer text-blue-500 w-full"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        {" "}
                        {showMoreLessLabel}
                      </div>
                    )}
                </div>
              </div>
              <div>
                {product.productVariants.length > 0 && (
                  <div className="left-[31px] top-[88px] text-sm font-bold leading-tight mb-2">
                    Variants
                  </div>
                )}
                <div className="max-sm:w-screen h-fit left-[30px] top-[122px] flex flex-wrap gap-2">
                  {product.productVariants.map((variant, index) => {
                    let isChosen = chosenProductVariantName === variant.name;
                    return (
                      <Variants
                        key={`Variant: ${index}`}
                        variant={variant}
                        setChosenProductVariantName={
                          setChosenProductVariantName
                        }
                        isChosen={isChosen}
                        isOutOfStock={isOutOfStock}
                      />
                    );
                  })}
                </div>
              </div>
              <h1
                className={`text-xl ${
                  isOutOfStock ? "text-red-500" : "text-green-500"
                } `}
              >
                {isOutOfStock ? "Out of Stock!" : "Available"}
              </h1>
              <div className="relative w-full flex flex-col justify-start sm:justify-between item-center text-black ">
                <div className="w-3/4 flex justify-between item-center">
                  <div
                    className={`${
                      isDarkMode ? "bg-neutral-700" : "bg-neutral-100"
                    } rounded-full flex justify-between items-center gap-3 fontColor`}
                  >
                    <button
                      onClick={() => {
                        if (quantity > 1 && product.state === "Available")
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
                    <div className="fontColor text-xl leading-7">
                      {/* ${product.price} */}
                      {product.isOnSale ? 
                        <div className="flex gap-2 ">
                          <div className="relative flex items-end ">
                            ${product.previousPrice}
                            <p className="absolute w-0.5 h-10 right-4 -top-1 transform rotate-45 rounded-full text-4xl bg-red-500 "></p>
                          </div>
                          <h1 className="font-bold text-2xl">${product.price}</h1>
                        </div> 
                      : `$${product.price}`}
                      
                    </div>
                  </div>
                </div>
                {isReachedLimit && (
                  <h1 className="text-red-500 mt-1 absolute -bottom-7">
                    Chosen Variant Quantity limit reached
                  </h1>
                )}
              </div>
              <div
                id="tooltip"
                className="relative"
                onMouseEnter={handleToggleTooltip}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {product.reviews && product.reviews.length > 0 && (
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
            {/* <div className="w-full text-center text-black text-3xl flex justify-center gap-3"> Total <h1 className="font-bold"> {product.price*quantity}</h1>  </div> */}
            <div className="w-full flex justify-center items-center flex-col pb-8 ">
              <div className=" w-full flex justify-center bgColor pb-4">
                <button
                  ref={detailsRef} 
                  disabled={isOutOfStock}
                  onClick={itemToCart}
                  className={`h-[60px] w-[263px] ${
                    product.state !== "Available" ? "bg-gray-300" : "opBgColor"
                  } rounded-full justify-center items-center gap-[15px] inline-flex`}
                >
                  <div className="opTxtColor text-xl font-bold ">
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
                <p className="text-[#4bc0d9] text-center max-sm:pb-8 ">
                  Please Select Your Desired Variant
                </p>
              )}
              {isItemAddedToCart && (
                <p className="text-green-500 text-center max-sm:pb-8 ">
                  Item Added Successfuly
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Similars from same Category */}
        {product.categories[0]?.products?.length > 0 && (
          <h2 className="pl-4 ">Other Related Products</h2>
        )}
        <div className="w-full overflow-x-auto h-fit px-2 pb-2">
          {product.categories[0]?.products?.length > 0 && (
            <div key={product.categories[0].id} 
              className="flex gap-3 items-center sm:justify-evenly mb-10 relative w-full pb-2"
            >
              {product.categories[0]?.products?.map((product, index) => (
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
        {product.reviews.length > 0 && (
          <div className="w-full h-1 bgColorGray "></div>
        )}
        {product.reviews.map((review) => (
          <ReviewCard key={`review card: ${review.id}`} review={review} />
        ))}
        <div className=" h-20 w-full"></div>
      </div>
      <ScrollButton rotationDegree={180} isObservedElementVisible={isLastOrderCardVisible} refe={detailsRef} />
    </div>
  );
};

export default ItemsDetailsPage;
