import Image from "next/image";
import { StartPage } from "./components";
import { getCategories, getCollections, getProducts } from "@/lib";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import HeroCarousel from "./components/HeroCarousel";
import HeroScrollBtn from "./components/HeroScrollBtn";
import HeroSignInBtn from "./components/HeroSignInBtn";

export async function getProductsData(searchText, category, onlyOnSale) {
  const products =
    (await getProducts(
      undefined,
      searchText,
      category,
      undefined,
      false,
      onlyOnSale
    )) || [];
  return products;
}
export async function getCollectionsData(searchText, category) {
  const products =
    (await getCollections(undefined, searchText, false, category)) || [];
  return products;
}
export async function getCategoriesData() {
  const Categories = (await getCategories()) || [];
  return Categories;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export default async function Home({ searchParams: { searchText, category } }) {
  const sessionData = await getServerSession(authOptions);
  const productsData =
    category !== "Collections & Sales"
      ? await getProductsData(searchText, category)
      : await getProductsData(searchText, undefined, true);
  const collectionsData = await getCollectionsData(searchText, category);
  const categoriesData = await getCategoriesData();
  //TODO: https://github.com/vercel/swr OR <Suspense fallback={...}/>
  if (!productsData)
    return (
      <div className="w-full h-full px-[63px] pt-[426px] pb-[95.82px] bg-white flex-col justify-end items-center gap-[291px] inline-flex">
        <div className="text-black text-[64px] font-bold">Electro M</div>
        <div className="flex justify-between w-full ">
          <Image
            width={60}
            height={60}
            className="w-[58px] h-[29.59px] "
            alt={generalAlt}
            src="/image 3.png"
          />
          <Image
            width={60}
            height={60}
            className="w-[58px] h-[39.18px] "
            alt={generalAlt}
            src="/Logo.svg"
          />
          <Image
            width={60}
            height={60}
            className="w-[58px] h-[29.59px] "
            alt={generalAlt}
            src="/image 9.png"
          />
        </div>
      </div>
    );

  return (
    <main className="h-full w-full">
      <div className="w-full h-full gap-12 relative bgColor flex-col justify-start items-center py-10 inline-flex overflow-y-scroll">
        <div className="absolute left-2 top-2 group flex items-center gap-2 ">
          <Image
            className="w-[50px]"
            src="/Logo.png"
            alt="Logo: Electro M"
            width={510}
            height={490}
          />
          <h1 className=" group-hover:text-lg fontColor transition-all duration-100 font-bold text-[0px]">
            Electro M
          </h1>
        </div>
        <div className="w-full flex justify-between items-center relative rounded-[20px] px-4 pt-10 max-sm:pt-20 pb-20 h-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 pt-40 dark:left-0 left-80 max-sm:left-0 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4bc0d9] to-[#88e0ed] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div className="w-1/2 max-sm:w-full ">
            <div className=" text-neutral-700 fontColor text-6xl font-bold mb-4 ">
              Elevate Your{" "}
              <span className="text-primaryColor">Mobile Experience</span>
            </div>
            <div className=" text-secondaryColor text-4xl font-semibold mt-0 mb-6  ">
              Empower Your Tech Life with Our Accessories Delight!
              {/* Discover the Latest in Smart Accessories */}
            </div>

            <div className="flex gap-2">
              <HeroScrollBtn />
              <HeroSignInBtn user={sessionData?.user} />
              {/* <button className="border-primaryColor border-2 px-11 transition-colors duration-100 py-2 rounded-sm text-primaryColor hover:text-white hover:bg-primaryColor">
                Sign In
              </button> */}
            </div>
          </div>

          <div className="w-1/2 flex justify-end px-4 max-sm:hidden ">
            <HeroCarousel />
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
  );
}
