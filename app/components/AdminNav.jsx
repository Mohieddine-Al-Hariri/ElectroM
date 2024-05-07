"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminNav = () => {
  const pathName = usePathname();

  return (
    <div className={`relative flex justify-center gap-2 mb-4 px-2 max-sm:pl-12 overflow-x-auto overflow-y-hidden `}>
      <Link href="/Admin/orders" className={pathName === "/Admin/orders" ? `p-2 text-2xl font-semibold border-b-2 borderColor fontColor` : "p-1 flex items-end text-md font-semibold border-b-2 border-gray-500 fontColorGray " }>Orders</Link>
      <Link href="/Admin/Products" className={pathName === "/Admin/Products" ? `p-2 text-2xl font-semibold border-b-2 borderColor fontColor ` : "p-1 flex items-end text-md font-semibold border-b-2 border-gray-500 fontColorGray " } > Products </Link>
      <Link href="/Admin/Categories" className={pathName === "/Admin/Categories" ? `p-2 text-2xl font-semibold border-b-2 borderColor fontColor ` : "p-1 flex items-end text-md font-semibold border-b-2 border-gray-500 fontColorGray " } > Categories </Link>
      <Link href="/Admin/Collections" className={pathName === "/Admin/Collections" ? `p-2 text-2xl font-semibold border-b-2 borderColor fontColor ` : "p-1 flex items-end text-md font-semibold border-b-2 border-gray-500 fontColorGray " } > Collections </Link>
    </div>
  )
}

export default AdminNav