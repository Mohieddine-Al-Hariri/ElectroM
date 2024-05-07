import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next"
//TODO: DELETE ALL apiCopy Folder

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST}