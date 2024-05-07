import ItemsDetailsPage from "@/app/components/ItemsDetailsPage";
import { getProductDetails, getTheUser } from "@/lib";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getProductDetailsData(productId) {
  const productDetails = (await getProductDetails(productId)) || [];
  return productDetails;
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const itemDetails = async ({ params }) => {
  const sessionData = await getServerSession(authOptions);
  const productDetails = await getProductDetails(params.id); 

  return <ItemsDetailsPage product={productDetails} user={sessionData?.user} />
  
}

export default itemDetails