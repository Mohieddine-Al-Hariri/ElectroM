"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const HeroSignInBtn = ({ user }) => {
  const router = useRouter();
  return (
    <button onClick={user ? () => router.push(`/Cart/${user.slug}`) : signIn} className="border-primaryColor border-2 px-11 max-sm:px-8 transition-colors duration-100 py-2 rounded-sm text-primaryColor hover:text-white hover:bg-primaryColor">
      {user ? "Go To Cart" : "Sign In"}
    </button>
  );
};

export default HeroSignInBtn;
