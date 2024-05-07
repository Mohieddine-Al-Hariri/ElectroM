import AdminCategoriesPage from "@/app/components/AdminCategoriesPage";
import { getCategories, getProductsForCollections } from "@/lib";

export async function getCategoriesData() {
  const categories = (await getCategories(true)) || [];
  return categories;
}
export async function getProductsData(searchText, cursor) {
  const Products = (await getProductsForCollections(searchText, cursor)) || [];
  return Products;
}
const page = async ({
  searchParams: { cursor, searchText, productsCursor, beforeOrAfter },
}) => {
  const categoriesData = await getCategoriesData();
  const productsData = await getProductsData(searchText, {
    cursor: productsCursor,
    beforeOrAfter,
  });
  return (
    <AdminCategoriesPage
      categoriesData={categoriesData}
      products={productsData.products}
      hasNextPage={productsData.pageInfo.hasNextPage}
      hasPreviousPage={productsData.pageInfo.hasPreviousPage}
    />
  );
};

export default page;
