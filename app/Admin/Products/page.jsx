import { getCategories, getCollections, getProducts } from "@/lib";
import { AdminProductsPage } from "@/app/components";


export async function getCategoriesData() {
  const Categories = (await getCategories()) || [];
  return Categories;
}
export async function getCollectionsData() {
  const collections = (await getCollections()) || [];
  return collections;
}
export async function getProductsData(searchText, category, collection) {
  const products = (await getProducts(undefined, searchText, category, collection, true)) || [];
  return products;
}
const page = async ({ searchParams: { searchText, category, collection } }) => {
  const categoriesData = await getCategoriesData();
  const productsData = await getProductsData(searchText, category, collection);
  const collectionsData = await getCollectionsData();
  const collections = collectionsData.collections.map(collection => (collection.node))
  return <AdminProductsPage 
    products={productsData.products} 
    searchText={searchText} 
    categoriesData={categoriesData} 
    collectionsData={collections}
    hasNextPage={productsData.pageInfo.hasNextPage}
  />
}

export default page