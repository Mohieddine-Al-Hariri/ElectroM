
import Image from 'next/image'
import { StartPage } from "./components"
import { getCategories, getCollections, getProducts } from '@/lib'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getProductsData(searchText, category, onlyOnSale) {
  const products = (await getProducts(undefined, searchText, category, undefined, false, onlyOnSale)) || [];
  return products;
}
export async function getCollectionsData(searchText, category) {
  const products = (await getCollections(undefined, searchText, false, category)) || [];
  return products;
}
export async function getCategoriesData() {
  const Categories = (await getCategories()) || [];
  return Categories;
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function Home({ searchParams: { searchText, category } }) {
  const sessionData = await getServerSession(authOptions);
  const productsData = category !== "Collections & Sales" ? await getProductsData(searchText, category) : await getProductsData(searchText, undefined, true);
  const collectionsData = await getCollectionsData(searchText, category);
  const categoriesData = await getCategoriesData();
  //TODO: https://github.com/vercel/swr OR <Suspense fallback={...}/>
  if(!productsData) 
    return (
      <div className="w-full h-full px-[63px] pt-[426px] pb-[95.82px] bg-white flex-col justify-end items-center gap-[291px] inline-flex">
      <div className="text-black text-[64px] font-bold">Electro M</div>
      <div className="flex justify-between w-full ">
        <Image width={60} height={60} className="w-[58px] h-[29.59px] " alt={generalAlt} src="/image 3.png" />
        <Image width={60} height={60} className="w-[58px] h-[39.18px] " alt={generalAlt} src="/Logo.svg" />
        <Image width={60} height={60} className="w-[58px] h-[29.59px] " alt={generalAlt} src="/image 9.png" />
      </div>
    </div>
  );

  return (
    <main className="h-full w-full">
      <div className="w-full h-full gap-12 relative bgColor flex-col justify-start items-center py-10 inline-flex overflow-y-scroll">
        <div className="w-full flex flex-col justify-center items-center relative bgColorGray rounded-[20px] ">
          
          <div className="relative max-w-7xl mx-auto ">
            <div className="animate-pulse duration-200 ">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#308ec7] to-[#3ca8d0] rounded-lg blur  opacity-50"></div>
            </div>
            <div className="relative rounded-[20px] bg-white ring-1 ring-gray-900/5 leading-none flex items-center justify-center ">
              <Image width={300} height={334} className="w-[333px] h-[250px] rounded-[20px] object-cover " src="/ElecrtoMLogo.png" alt="gear up"/>
            </div>
          </div>
          <div className=" text-neutral-700 fontColor text-xl font-bold m-2 mb-0 ">Special for You.</div>
          <div className=" text-neutral-700 fontColorGray text-sm font-thin m-2 mt-0 text-center ">"Empower Your Tech Life with Our Accessories Delight!"</div>
          
          <div className="w-full flex flex-col justify-center items-center fontColor pt-4 ">
            <div className="flex items-center ">
              <a className={` flex justify-center bg-[#25D366] text-white items-center rounded-full aspect-square p-1  `} href="https://wa.me/+96176021231" target="_blank">
                <svg
                  fill="currentColor"
                  width= "22px"
                  height= "22px"
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
                  <Image src="/Instagram-Logo.wine.svg" width="60" height="60" alt="instagram logo" />
                </div>
              </a>
            </div>
          </div>
        </div>
        <StartPage 
          categoriesData={categoriesData} 
          searchedCategory={category} 
          products={productsData.products}
          collectionsData={collectionsData}
          hasNextPage={productsData?.pageInfo?.hasNextPage || false}
          searchText={searchText} 
          user={sessionData?.user}
        />
      </div>
    </main>
  )
}
