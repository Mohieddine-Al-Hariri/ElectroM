import AdminCollectionsPage from "@/app/components/AdminCollectionsPage";
import { getCollections, getProductsForCollections } from "@/lib";

export async function getCollectionsData(cursor, searchText) {
  const collections = (await getCollections(cursor, searchText, true)) || [];
  return collections;
}
export async function getProductsData(searchText, cursor) {
  const products =
    (await getProductsForCollections(searchText, cursor)) ||
    [];
  return products;
}

const page = async ({ searchParams: { cursor, searchText, productsCursor, beforeOrAfter } }) => {
  const collectionsData = await getCollectionsData(cursor, searchText);
  const productsData = await getProductsData(searchText, {cursor: productsCursor, beforeOrAfter});
  return (
    <AdminCollectionsPage
      collectionsData={collectionsData.collections}
      productsData={productsData.products}
      hasNextPage={productsData.pageInfo.hasNextPage}
      hasPreviousPage={productsData.pageInfo.hasPreviousPage}
    />
  );
};

export default page;
