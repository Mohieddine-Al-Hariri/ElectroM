"use client"
// import { disconnectItemFromOrder, publishCollection, publishOrder, publishProduct, publishReview, removeOrder, reviewCollection, reviewProduct } from "@/lib";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactStars from 'react-rating-star-with-type';
import { SVGLoading } from ".";


const ItemCardReview = ({ collection, product, userId, orderId, itemId, isFirstRender, isLastItem, submitReview }) => {
  const [star, setStar] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  
  useEffect(() => {
    if(isFirstRender) {
      const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
      if(isDarkModeLocal) document.body.classList.add('dark');
      else document.body.classList.remove('dark');
    }
  }, []);
  const onStarChange = (nextValue) => {
    setIsRated(true);
    setStar(nextValue);
  }
  const submitProductReview = async () => {
    
    if(!isRated) {
      setIsError(true);
      setTimeout(function () {
        setIsError(false);
      }, 3000);
      return
    }
    setIsError(false);
    setIsLoading(true);

    if(collection) await submitReview({headline, content, rating: star, collectionId: collection.id, userId, orderId, itemId}, true, isLastItem)
    else await submitReview({headline, content, rating: star, productId: product.id, userId, orderId, itemId}, false, isLastItem);

    // if(collection){
    //   const reviewedCollection = await reviewCollection({headline, content, rating: star, collectionId: collection.id, userId, orderId, itemId})
    //   .catch((e) => {
    //     console.log(e);
    //     setIsLoading(false);
    //   });
    //   await publishReview(reviewedCollection.reviews[reviewedCollection.reviews.length - 1].id)

    // } else{
    //   const reviewedProduct = await reviewProduct({productId: product.id, headline, content, rating: star, userId, orderId, itemId});
    //   await publishReview(reviewedProduct.reviews[reviewedProduct.reviews.length - 1].id);
    // }

    //Remove order from user's view if no more items available to review
    // if(isLastItem) await removeOrder(orderId); 
    // else await publishOrder(orderId); //else publish this order

    // router.refresh();
    setIsLoading(false);
  }

  const images = collection?.products.map(product => product.imageUrls[0].url);

  return (
    <div className="bgColorGray rounded-md pb-2 w-full lg:flex ">
      {/* <div className="lg:w-full lg:flex md:justify-center ">  */}
        <div className={`relative shadow-lg ${(collection && !collection?.imageUrl) ? "overflow-y-scroll" : "overflow-hidden"} rounded-lg h-[200px] sm:w-1/2 md:w-1/3 lg:w-1/4 p-0`}>
          {product? 
            <Image width={100} height={100} className="h-full w-full object-cover" src={product.imageUrls[0].url} alt={product.name}/>
          :
            collection.imageUrl ?
              <Image width={100} height={100} className="h-full w-full object-cover" src={collection.imageUrl} alt={collection.name}/>
            :
              <div className="flex flex-wrap justify-center items-center grow ">
                {images.map((image, index) => (
                  <div key={index} className="relative flex justify-center rounded-lg overflow-hidden" >
                    <Image
                      className="h-full w-1/8 object-cover pointer-events-none"
                      width={100}
                      height={100}
                      src={image}
                      alt={`Image ${index + 1}`}
                      key={`Image ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
          }
          <div className={`${(collection && !collection?.imageUrl) ? "absolute" : "sticky"} top-0 left-0 right-0 bottom-0 w-full h-full bg-black/40 flex justify-center items-center flex-col text-white pointer-events-none`}>
            <h1>{collection?.name || product.name}</h1>
            {/* <ReactStars 
              count={5}
              value={star}
              // edit={true}
              activeColors={[ "red", "orange", "#FFCE00", "#4bc4d9","#4bc0d9",]}
              size={24}
              // isEdit={true}  
            /> */}
          </div>
        </div>
      {/* </div> */}
      <div className="w-full flex flex-col gap-2 mt-2 px-2 colorScheme fontColor ">
        <div className="flex text-lg justify-center items-center ">
          <ReactStars 
            count={5}
            onChange={onStarChange} 
            value={star}
            edit={true}
            isHalf={true}
            isEdit={true}
            activeColors={[ "red", "orange", "#FFCE00", "#4bc4d9","#4bc0d9",]}
            size={24}
          />
          {star}
        </div>

        <label className="flex flex-col " htmlFor="headline">
          Headline
          <input onChange={(e) => setHeadline(e.target.value)} value={headline} type="text" id="headline" className="rounded-lg px-2 py-1 " />
        </label>
        <label className="flex flex-col " htmlFor="comment">
          Comment
          <textarea onChange={(e) => setContent(e.target.value)} value={content} type="text" id="comment" className="rounded-lg px-2 py-1 " />
        </label>

        {isLoading ?
          <button disabled={true} className="bgColor rounded-lg py-1 px-2 hover:bg-[#4bc0d9] flex justify-center items-center"><SVGLoading/></button>
        :
          <button disabled={isLoading} onClick={submitProductReview} className="bgColor rounded-lg py-1 px-2 hover:bg-[#4bc0d9] ">{isError ? "Please Rate before submiting" : "Submit"}</button>
        }
      </div>
      
    </div>
  )
}

export default ItemCardReview