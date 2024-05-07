import { redirect } from "next/navigation"
import { CredentialsForm } from "../components"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/auth"

const signIn = async () => {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/")
  }
  return (
    <div className=' flex overflow-y-hidden max-lg:items-start justify-center items-start max-sm:fixed h-full m-0 w-full text-white gap-2 bg-white pb-10 max-lg:pt-0 max-sm:py-10'>
      <CredentialsForm />
    </div>
  )
}

export default signIn
