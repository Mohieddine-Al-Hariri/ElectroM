import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const SingingBtn = ( { user } ) => {

  const router = useRouter();

  return (
    <div>
      {user ?
        <button
        onClick={() => {router.push("/"); signOut()}}
        className="fontColor rounded-lg max-sm:ml-0 text-2xl">Sign Out</button>
        :<button onClick={()=>signIn()} className= { `bg-[#2482c8] signInBtn rounded-lg px-4 py-2 ml-4 max-sm:ml-0 font-semibold  hover:bg-transparent border-2 transition duration-200 hover:border-[#2482c8] border-solid hover:shadow-[#2482c8] shadow` } >Sign In</button>
      }
    </div>
  )
}

export default SingingBtn