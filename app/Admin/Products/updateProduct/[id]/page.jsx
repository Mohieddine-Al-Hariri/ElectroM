import UpdateProductForm from "@/app/components/UpdateProductForm";
import { getCategories, getCollections, getProductDetails } from "@/lib";

export async function getCategoriesData() {
  const Categories = (await getCategories()) || [];
  return Categories;
}
export async function getProductsData(id) {
  const products = (await getProductDetails(id)) || [];
  return products;
}
export async function getCollectionsData() {
  const collections = (await getCollections()) || [];
  return collections;
}

const page = async ({ params: { id } }) => {

  const categoriesDataPromise = getCategoriesData();
  const productDataPromise = getProductsData(id);
  const collectionDataPromise = getCollectionsData();

  const [categoriesData, productData, collectionsData] = await Promise.all([
    categoriesDataPromise, productDataPromise, collectionDataPromise
  ])

  return <UpdateProductForm 
    categoriesData={categoriesData} 
    productData={productData} 
    collectionsData={collectionsData.collections} 
  />
}

export default page