// import Link from 'next/link'
import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Navbar from './components/Navbar'
import { constructMetadata } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = constructMetadata()
export const viewport = {
  themeColor: '#209786',
}
// export const metadata = {
//   title: 'Electro M',
//   description: 'Generated by create next app',
// }

export default async function RootLayout({ children, authModal }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className='fixed top-0 bottom-0 left-0 right-0 overflow-hidden flex justify-center items-center grainy'>
      <body className={`${inter.className} bg-white transition-colors duration-100 bg-no-repeat h-full w-screen grainy`}>
        {/*TODO: {authModal}*/}
        {children}
        <Navbar userSlug={session?.user?.slug} userRole={session?.user?.userRole} cartId={session?.user?.cartId} />
      </body>
    </html>
  )
}
