"use client"
import { signOut } from "next-auth/react";
import Link from "next/link"
import { usePathname } from 'next/navigation';

const Navbar = ({ userSlug, userRole }) => {
  const pathName = usePathname();

  return (
    <div className=" w-full flex items-center justify-center px-10 fixed z-30 bottom-5 overflow-hidden pointer-events-none">
      <div className="w-[310px] h-fit flex items-center justify-between bg-white bg-opacity-75 rounded-full px-4 pointer-events-auto ">
      <Link href={`/Cart/${userSlug}`} className={` ${pathName.slice(0,6) === "/Cart/" ? "border-[#4bc0d9] " : "border-none "} border-b-2 rounded-full text-[black] hover:bg-[#4bc0d9] hover:text-[#f3f3f3] p-2  `}>
        <svg width="24px" height="24px" viewBox="0 0 0.72 0.72" fill="none" xmlns="http://www.w3.org/2000/  svg"><title>Cart</title><path d="M0.15 0.21h0.414a0.06 0.06 0 0 1 0.06 0.066l-0.018 0.18A0.06 0.06 0 0 1 0.546 0.51H0.259a0.06 0.06 0 0 1 -0.059 -0.048L0.15 0.21Z" stroke="currentColor" strokeWidth="0.06" strokeLinejoin="round"/><path d="m0.15 0.21 -0.024 -0.097A0.03 0.03 0 0 0 0.097 0.09H0.06" stroke="currentColor" strokeWidth="0.06" strokeLinecap="round" strokeLinejoin="round"/><path d="M0.24 0.63h0.06" stroke="currentColor" strokeWidth="0.06" strokeLinecap="round" strokeLinejoin="round"/><path d="M0.48 0.63h0.06" stroke="currentColor" strokeWidth="0.06" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
      <Link href="/" className={` ${pathName.length === 1 ? "border-[#4bc0d9] " : "border-none "} border-b-2 rounded-full text-[black] hover:bg-[#4bc0d9] hover:text-[#f3f3f3] p-2  `}>
        <svg width="24px" height="24px" viewBox="0 0 0.563 0.563" fill="none" xmlns="http://www.w3.org/2000/svg"><title>{"Home"}</title><path d="m0.281 0.019 0.012 -0.014a0.019 0.019 0 0 0 -0.024 0L0.281 0.019Zm-0.263 0.225 -0.012 -0.014L0 0.235v0.009h0.019Zm0.188 0.3v0.019a0.019 0.019 0 0 0 0.019 -0.019h-0.019Zm0.15 0H0.337a0.019 0.019 0 0 0 0.019 0.019v-0.019Zm0.188 -0.3h0.019v-0.009l-0.007 -0.006 -0.012 0.014ZM0.056 0.563h0.15v-0.037h-0.15v0.037Zm0.5 -0.333 -0.263 -0.225 -0.024 0.028 0.263 0.225 0.024 -0.028Zm-0.287 -0.225 -0.263 0.225 0.024 0.028 0.263 -0.225 -0.024 -0.028ZM0.225 0.544v-0.112H0.188v0.112h0.037Zm0.112 -0.112v0.112h0.037v-0.112H0.337Zm0.019 0.131h0.15v-0.037h-0.15v0.037Zm0.206 -0.056v-0.263h-0.037v0.263h0.037Zm-0.563 -0.263v0.263h0.037v-0.263H0ZM0.281 0.375A0.056 0.056 0 0 1 0.337 0.431h0.037A0.094 0.094 0 0 0 0.281 0.337v0.037Zm0 -0.037A0.094 0.094 0 0 0 0.188 0.431h0.037A0.056 0.056 0 0 1 0.281 0.375V0.337Zm0.225 0.225a0.056 0.056 0 0 0 0.056 -0.056h-0.037a0.019 0.019 0 0 1 -0.019 0.019v0.037Zm-0.45 -0.037a0.019 0.019 0 0 1 -0.019 -0.019H0A0.056 0.056 0 0 0 0.056 0.563v-0.037Z" fill="currentColor"/></svg></Link>
      <Link href={userSlug? `/userProfile/${userSlug}` : "/SignIn"} className={` ${pathName.slice(0,13) === "/userProfile/" ? "border-[#4bc0d9] " : "border-none "} border-b-2 rounded-full text-[black] hover:bg-[#4bc0d9] hover:text-[#f3f3f3] p-2 `}>
        <svg width="24px" height="24px" viewBox="0 0 0.72 0.72" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Profile</title><g id="style=stroke"><g id="profile"><path id="vector (Stroke)" fillRule="evenodd" clipRule="evenodd" d="M0.36 0.082a0.112 0.112 0 1 0 0 0.225 0.112 0.112 0 0 0 0 -0.225ZM0.202 0.195a0.158 0.158 0 1 1 0.315 0 0.158 0.158 0 0 1 -0.315 0Z" fill="currentColor"/><path id="rec (Stroke)" fillRule="evenodd" clipRule="evenodd" d="M0.128 0.557a0.16 0.16 0 0 1 0.16 -0.16h0.146a0.16 0.16 0 0 1 0.16 0.16 0.125 0.125 0 0 1 -0.125 0.125H0.253a0.125 0.125 0 0 1 -0.125 -0.125Zm0.16 -0.115a0.115 0.115 0 0 0 -0.115 0.115c0 0.044 0.036 0.08 0.08 0.08h0.214c0.044 0 0.08 -0.036 0.08 -0.08 0 -0.063 -0.051 -0.115 -0.115 -0.115H0.287Z" fill="currentColor"/></g></g></svg>
      </Link>
      
      {userRole === "Admin" && 
        <Link href="/Admin/orders" className={` ${pathName.slice(0,7) === "/Admin/" ? "border-[#4bc0d9] " : "border-none "} border-b-2 rounded-full text-[black] hover:bg-[#4bc0d9] hover:text-[#f3f3f3] p-2 `}>
          <svg
            fill="currentColor"
            width="26px"
            height="26px"
            viewBox="0 0 1.35 1.35"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <title>{"Adminstirator Settings"}</title>
            <path
              d="M0.55 0.555a0.254 0.254 0 1 1 0.254 -0.253 0.254 0.254 0 0 1 -0.254 0.253Zm0 -0.432a0.178 0.178 0 1 0 0.178 0.178 0.178 0.178 0 0 0 -0.178 -0.178Z"
              className="clr-i-outline clr-i-outline-path-1"
            />
            <path
              d="M0.616 1.188A0.08 0.08 0 0 1 0.593 1.125H0.15v-0.217a0.555 0.555 0 0 1 0.416 -0.175h0.027a0.083 0.083 0 0 1 0.023 -0.069l0.004 -0.004c-0.018 0 -0.037 -0.002 -0.055 -0.002A0.618 0.618 0 0 0 0.083 0.872a0.037 0.037 0 0 0 -0.007 0.022V1.125a0.075 0.075 0 0 0 0.075 0.075h0.476Z"
              className="clr-i-outline clr-i-outline-path-2"
            />
            <path
              d="M1.008 0.611a0.014 0.014 0 0 1 0.006 0 0.016 0.016 0 0 0 -0.006 0Z"
              className="clr-i-outline clr-i-outline-path-3"
            />
            <path
              d="m1.263 0.874 -0.075 -0.023a0.27 0.27 0 0 0 -0.022 -0.053l0.037 -0.07A0.014 0.014 0 0 0 1.2 0.713l-0.054 -0.054a0.013 0.013 0 0 0 -0.017 -0.003l-0.069 0.037a0.268 0.268 0 0 0 -0.054 -0.023l-0.023 -0.075a0.013 0.013 0 0 0 -0.013 -0.009h-0.077a0.013 0.013 0 0 0 -0.013 0.01l-0.023 0.075a0.263 0.263 0 0 0 -0.054 0.022l-0.068 -0.037a0.013 0.013 0 0 0 -0.016 0.003L0.663 0.713a0.014 0.014 0 0 0 -0.002 0.017l0.037 0.068a0.254 0.254 0 0 0 -0.024 0.054l-0.075 0.022a0.013 0.013 0 0 0 -0.01 0.013v0.077A0.013 0.013 0 0 0 0.6 0.975l0.075 0.023a0.263 0.263 0 0 0 0.022 0.053l-0.037 0.072a0.013 0.013 0 0 0 0.002 0.016l0.054 0.054a0.014 0.014 0 0 0 0.017 0.003l0.07 -0.037a0.266 0.266 0 0 0 0.052 0.021l0.022 0.075a0.014 0.014 0 0 0 0.013 0.01h0.077a0.014 0.014 0 0 0 0.013 -0.01l0.023 -0.077a0.26 0.26 0 0 0 0.052 -0.021l0.071 0.037a0.013 0.013 0 0 0 0.016 -0.003L1.2 1.14a0.013 0.013 0 0 0 0 -0.015l-0.037 -0.07a0.263 0.263 0 0 0 0.022 -0.052l0.075 -0.023a0.013 0.013 0 0 0 0.01 -0.013v-0.079a0.013 0.013 0 0 0 -0.006 -0.013ZM0.932 1.05a0.125 0.125 0 1 1 0.125 -0.125A0.125 0.125 0 0 1 0.932 1.05Z"
              className="clr-i-outline clr-i-outline-path-4"
            />
            <path
              x={0}
              y={0}
              width={36}
              height={36}
              fillOpacity={0}
              d="M0 0H1.35V1.35H0V0z"
            />
          </svg>
        </Link>
      }
      {/* <button onClick={signOut} className="fontColor">signOut</button> */}
      </div>
    </div>
  )
}

export default Navbar