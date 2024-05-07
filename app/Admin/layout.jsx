import AdminNav from "../components/AdminNav"
import { authOptions } from "@/lib/auth"
import { getTheUser } from "@/lib"
import { getServerSession } from "next-auth";

export const getTheUserData = async (userSlug) => {
  const theUser = await getTheUser(userSlug, true);
  return theUser
}

const Layout = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect('/SignIn');
  }
  const theUser = await getTheUserData(session.user.slug);
  if(theUser.userRole.role !== "Admin") redirect('/');

  return (
    <div className="flex flex-col h-screen bgColor  ">
      <AdminNav/>
      {children}
    </div>
  )
}

export default Layout