import CollectionDetailsPage from "@/app/components/CollectionDetailsPage";
import { getCollectionDetails } from "@/lib";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getCollectionDetailsData(collectionId) {
  const productDetails = (await getCollectionDetails(collectionId)) || [];
  return productDetails;
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const itemDetails = async ({ params }) => {
  const sessionData = await getServerSession(authOptions);
  const collectionDetails = await getCollectionDetailsData(params.id); 

  return <CollectionDetailsPage collection={collectionDetails} user={sessionData?.user} />
  
}

export default itemDetails