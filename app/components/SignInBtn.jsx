"use client"
import { signIn } from 'next-auth/react'

const SignInBtn = () => {
  return (
    <div className='pb-20 w-3/4 flex justify-center '>
      <button onClick={signIn} className="w-full h-[50px] px-4 py-2 bg-[#4bc0d9] text-white hover:bg-[#3ca8d0] rounded-lg border-black justify-around items-center gap-[3px] flex">
        <div className=" text-center text-[23px] font-semibold flex items-center gap-4">
          <h2>SignIn</h2>
        </div>
      </button>
    </div>
  )
}

export default SignInBtn