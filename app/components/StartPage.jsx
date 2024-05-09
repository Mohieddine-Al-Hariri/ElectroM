"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import SearchBar from "./SearchBar";
import { useIsVisible } from "./UseVisible";
import { addManyItemsToCart, getProducts, publishCart, publishItemAddedToCart, publishManyItemsAddedToCart } from "@/lib";
import { useRouter } from 'next/navigation';
import { FilterSelect, NoResultsFound, ProductCard, ScrollButton } from ".";
import { Fade } from "react-awesome-reveal";

export const LoadingCard = () => {
  return (
    <div 
      className="relative overflow-hidden rounded-lg h-[200px] max-w-[356px] w-full grow hover:scale-[1.1] duration-200 shadow-lg bg-gray-200 animate-pulse"
    >
      <div className='absolute bottom-0 left-0 px-4 py-2 w-full'>
        <h1 className=" bg-white rounded-full w-1/2 h-4 mb-2"></h1>
        <h1 className=" bg-white rounded-full w-3/4 h-4"></h1>
      </div>
    </div>
  )
}
const StartPage = ({ products, hasNextPage, user, searchText, categoriesData, searchedCategory, collectionsData }) => {
  const [productsState, setProductsState] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  //Pagination
  const [lastProductCursor, setLastProductCursor] = useState(products ? products[products?.length - 1]?.cursor : "");
  const [doesHaveNextPage, setDoesHaveNextPage] = useState(hasNextPage);
  const lastProductCardRef = useRef();
  const isLastProductCardVisible = useIsVisible(lastProductCardRef);
  const [isFirstRedner, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(searchedCategory || 'All');
  const [resetSearchText, setResetSearchText] = useState(false);
  
  const topRef = useRef(null);
  const isCategoryFilterVisible = useIsVisible(topRef);
  const router = useRouter();

  const addItemsToCart = async (localCart) => { 
  //Add items to cart in DB from localStorage since user logged in
    const cartId = user.cartId;
    const items = localCart.map((item) => {
      
      const connectTo = !item.isCollection ? {
        product: {
          connect: {
            id: item.product.id
          }
        }
      } : {
        collection: {
          connect: {
            id: item.collection.id
          }
        }
      }

      return({
        quantity: item.quantity,
        total: item.total,
        orderItemVariants: {create: item.orderItemVariants},
        variant: item.variant,
        ...connectTo
      })
      
    });

    await addManyItemsToCart({cartId, items, userId: user.id})
    .then(async (res) => { 
      const orderItemsPublished = await publishManyItemsAddedToCart(res.orderItems);
    });

    localStorage.removeItem("cart");
  }

  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"));
    if(isDarkModeLocal) {
      document.body.classList.add('dark');
      setIsDarkMode(true);
    } 
    else {
      document.body.classList.remove('dark');
      setIsDarkMode(false);
    }
    const localCart = JSON.parse(localStorage.getItem("cart"));
    // console.log(localCart)
    if(user && localCart){
      addItemsToCart(localCart);
    }

  }, []);

  
  useEffect(() => {
    let colls = [];

    if (collectionsData) {
      colls = collectionsData.collections.slice(0, selectedCategory === 'Collections & Sales' ? undefined : 4);
      colls = colls.map(collection => {
        const images = collection.node.products?.map(product => product.imageUrls[0]);
        return {
          node: {
            ...collection.node,
            excerpt: collection.node.description,
            reviews: collection.node.reviews,
            imageUrls: images,
            isCollection: true,
          },
        };
      });
    }

    
    const combined = products.slice(); // Create a shallow copy of products
    let collsIndex = 0;

    for (let i = 0; i < combined.length + colls.length; i++) {
      if (i % 2 === 1 && collsIndex < colls.length) {
        combined.splice(i, 0, colls[collsIndex++]);
      }
    }
  
    setProductsState(combined);
  
    setDoesHaveNextPage(hasNextPage);
  }, [products, hasNextPage, selectedCategory, collectionsData]);
  // useEffect(() => {
  //   let colls = [];
  //   // if (selectedCategory === 'Collections & Sales') {
  //   //   setProductsState(products);
  //   // } else {
  //     colls = collectionsData?.collections.slice(0, 4).map(collection => {
  //       const images = collection.node.products?.map(product => product.imageUrls[0]);
  //       return {
  //         node: {
  //           ...collection.node,
  //           excerpt: collection.node.description,
  //           reviews: collection.node.reviews,
  //           imageUrls: images,
  //           isCollection: true,
  //         },
  //       };
  //     });
  //   // }

  //   // if (selectedCategory === 'Collections & Sales') {
  //   //   setProductsState(products);
  //   // } else {
  //     const combined = products.slice(); // Create a shallow copy of products
  //     let collsIndex = 0;
  
  //     for (let i = 0; i < combined.length + colls.length; i++) {
  //       if (i % 2 === 1 && collsIndex < colls.length) {
  //         combined.splice(i, 0, colls[collsIndex++]);
  //       }
  //     }
  
  //     setProductsState(combined);
  //   // }
  
  //   setDoesHaveNextPage(hasNextPage);
  // }, [products, hasNextPage, selectedCategory, collectionsData]);
  
  const getMoreProducts = async () => {
    let searchedCategoryPagination = undefined;
    let isOnSale = false;
    if(searchedCategory){
      if(searchedCategory === "All") return
      else if(searchedCategory === "Collections & Sales") isOnSale = true;
      else searchedCategoryPagination = searchedCategory
    }

    //TODO: create an env var specific for this pagination...
    const paginatedProducts = await getProducts(lastProductCursor, searchText, searchedCategory, undefined, false, isOnSale);
    return paginatedProducts;
  }

  useEffect(() => {
    if(isFirstRedner){
      setIsFirstRender(false);
    }
    else if(doesHaveNextPage && !isLoading){
      setIsLoading(true);
      getMoreProducts().then((result) => {    
        result.pageInfo.hasNextPage && setLastProductCursor(result.products[result.products.length - 1].cursor);
        setDoesHaveNextPage(result.pageInfo.hasNextPage);
        setProductsState([ ...productsState, ...result.products]);
        setIsFirstRender(true);
        setIsLoading(false);
      });
    }
  },[isLastProductCardVisible]);

  const handleNavigation = (category) => {
    const currentParams = new URLSearchParams(window.location.search);
    if(category === 'All') currentParams.delete("category");
    else currentParams.set("category", category);
    currentParams.delete("cursor");
    currentParams.delete("search");

    const newSearchParams = currentParams.toString();
    const newPathname = `${window.location.pathname}?${newSearchParams}`;
    router.push(newPathname);
  };
  useEffect(() => {
    handleNavigation(selectedCategory);
  },[selectedCategory])
  return (
      <div>

        <div className="w-full flex justify-center max-sm:items-center items-end  max-sm:gap-2 gap-4 mb-4 max-sm:flex-col fontColor">
          <FilterSelect 
            refe={topRef} 
            options={categoriesData} 
            extraOptions={[{name: "Collections & Sales", slug: "Collections & Sales"}]} 
            searchedSelection={searchedCategory}
            filterBy="Category"
            setResetSearchText={setResetSearchText}
          />
          <SearchBar searched={searchText}/>
        </div>

        <div className=" text-neutral-700 fontColorGray text-xl font-bold leading-normal ml-5">Items</div>
          <div className="w-full h-full flex items-start justify-around lg:justify-between flex-wrap gap-1 p-4 relative ">
            <Fade triggerOnce={true} className="overflow-hidden rounded-lg h-[200px] max-w-[356px] w-full grow hover:scale-[1.1] hover:z-10 relative duration-200  ">
              {productsState?.map(({node}) => (
                <ProductCard 
                  key={`Product Card: ${node.id}`} 
                  id={node.id} 
                  name={node.name} 
                  excerpt={node.excerpt} 
                  imageUrl={node.imageUrl ? node.imageUrl : node.imageUrls[0]?.url} 
                  reviews={node.reviews} 
                  isOnSale={node.isOnSale}
                  isCollection={node.isCollection}
                />
              ))}
              {productsState?.length === 0 && <NoResultsFound/>}
            </Fade>

            {/* Pagination controls */}
            {isLoading && 
              <>
                <LoadingCard/>
                <LoadingCard/>
                <LoadingCard/>
              </>
            }
            {!doesHaveNextPage && <div className="flex relative h-40 w-full backGround fontColor text-2xl justify-center items-center rounded-lg ">
              <div className="w-full flex flex-col justify-center items-center fontColor pt-4 ">
                You can contact us on
                <div className="flex items-center mt-2 ">
                  <a className={` flex justify-center bg-[#25D366] text-white items-center rounded-full aspect-square p-1  `} href="https://wa.me/+96176021231" target="_blank">
                    <svg
                      fill="currentColor"
                      width= "26px"
                      height= "26px"
                      viewBox="-0.075 -0.075 0.9 0.9"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMinYMin"
                      className="jam jam-whatsapp"
                    >
                      <path d="M0.357 0C0.158 0.01 0.001 0.174 0.001 0.372a0.367 0.367 0 0 0 0.041 0.167L0.002 0.731a0.015 0.015 0 0 0 0.018 0.017l0.189 -0.044a0.374 0.374 0 0 0 0.161 0.039c0.204 0.003 0.373 -0.157 0.379 -0.359C0.756 0.167 0.576 -0.01 0.357 0zm0.225 0.576a0.292 0.292 0 0 1 -0.207 0.085 0.291 0.291 0 0 1 -0.13 -0.03l-0.026 -0.013 -0.116 0.027 0.024 -0.117 -0.013 -0.025A0.286 0.286 0 0 1 0.082 0.371c0 -0.078 0.03 -0.151 0.086 -0.206a0.294 0.294 0 0 1 0.207 -0.085c0.078 0 0.152 0.03 0.207 0.085a0.288 0.288 0 0 1 0.086 0.206c0 0.077 -0.031 0.151 -0.086 0.206z" />
                      <path d="m0.557 0.452 -0.072 -0.021a0.027 0.027 0 0 0 -0.027 0.007l-0.018 0.018a0.027 0.027 0 0 1 -0.029 0.006c-0.034 -0.014 -0.106 -0.077 -0.125 -0.109a0.026 0.026 0 0 1 0.002 -0.029l0.015 -0.02a0.027 0.027 0 0 0 0.003 -0.027L0.277 0.208a0.027 0.027 0 0 0 -0.042 -0.01c-0.02 0.017 -0.044 0.043 -0.047 0.071 -0.005 0.05 0.017 0.114 0.099 0.19 0.095 0.088 0.171 0.1 0.221 0.088 0.028 -0.007 0.051 -0.034 0.065 -0.056a0.027 0.027 0 0 0 -0.015 -0.04z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/electronics_mohie/" target="_blank">
                    <div className="">
                      <Image src="/Instagram-Logo.wine.svg" width="80" height="80" alt="instagram logo" />
                    </div>
                  </a>
                </div>
              </div>  
            </div> }
            {/* Add an invisible element to act as the previousProductCardRef */}
            <div className="w-full h-[60px]" ref={lastProductCardRef} style={{ visibility: "hidden" }} />
          </div>
        <ScrollButton rotationDegree={0} isObservedElementVisible={isCategoryFilterVisible} refe={topRef} bgColor="bg-[#4bc0d9]" textColor="text-white" />

      </div>
      
    
  )
}
  
export default StartPage