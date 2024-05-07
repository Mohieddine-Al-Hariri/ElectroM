import { signIn } from 'next-auth/react'

export const GoogleSignInButton = () => {

	const handleClick = async () => {
		const signInResponse = await signIn('google', { callbackUrl: "/" });
	}

	return(
		<button type='button' onClick={(e) => {e.preventDefault(); handleClick()}} className='w-full flex items-center justify-center gap-2 font-semibold h-14 px-6 max-sm:text-sm max-sm:px-2 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200'>
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" styles="enable-background:new 0 0 512 512;" xmlSpace="preserve" width="20" height="20"><path fill="currentColor" className='text-[#167EE6]' d="m19.245 8.261 -8.158 0c-0.36 0 -0.652 0.292 -0.652 0.652v2.606c0 0.36 0.292 0.652 0.652 0.652h4.594c-0.503 1.306 -1.442 2.399 -2.64 3.094L15 18.656c3.142 -1.817 5 -5.006 5 -8.575 0 -0.508 -0.037 -0.872 -0.112 -1.281 -0.057 -0.311 -0.327 -0.538 -0.643 -0.538z"/><path fill="currentColor" className='text-[#12B347]' d="M10 16.087c-2.248 0 -4.211 -1.228 -5.265 -3.046l-3.391 1.954C3.07 17.986 6.302 20 10 20c1.814 0 3.526 -0.488 5 -1.34v-0.005l-1.959 -3.391c-0.896 0.52 -1.933 0.822 -3.041 0.822z"/><path fill="currentColor" className='text-[#0F993E]' d="M15 18.66v-0.005l-1.959 -3.391c-0.896 0.52 -1.933 0.822 -3.041 0.822V20c1.814 0 3.526 -0.488 5 -1.34z"/><path fill="currentColor" className='text-[#FFD500]' d="M3.913 10c0 -1.108 0.302 -2.145 0.822 -3.041l-3.391 -1.954C0.488 6.474 0 8.181 0 10s0.488 3.526 1.344 4.995l3.391 -1.954c-0.52 -0.896 -0.822 -1.933 -0.822 -3.041z"/><path fill="currentColor" className='text-[#FF4B26]' d="M10 3.913c1.466 0 2.813 0.521 3.865 1.387 0.259 0.214 0.637 0.198 0.874 -0.039l1.846 -1.846c0.27 -0.27 0.25 -0.711 -0.038 -0.961C14.785 0.925 12.492 0 10 0 6.302 0 3.07 2.014 1.344 5.005l3.391 1.954c1.054 -1.818 3.017 -3.046 5.265 -3.046z"/><path fill="currentColor" className='text-[#D93F21]' d="M13.865 5.301c0.259 0.214 0.637 0.198 0.874 -0.039l1.846 -1.846c0.27 -0.27 0.25 -0.711 -0.038 -0.961C14.785 0.925 12.492 0 10 0v3.913c1.466 0 2.813 0.521 3.865 1.387z"/></svg>
			<span>Sign in with Google</span>
		</button>
	)
}



export const FacebookSignInButton = () => {
	const handleClick = async () => {
		const signInResponse = await signIn('facebook', { callbackUrl: "/" });
	}
	return (
		<button type='button' onClick={() => signIn('facebook')} className='w-full flex items-center justify-center gap-2 font-semibold h-14 px-6 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200'>
			<svg width="25px" height="25px" viewBox="0 0 0.4 0.4" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#1877F2" d="M0.375 0.2A0.175 0.175 0 0 0 0.2 0.025 0.175 0.175 0 0 0 0.172 0.372V0.25H0.128V0.2H0.172V0.161C0.172 0.117 0.199 0.093 0.239 0.093 0.258 0.093 0.278 0.097 0.278 0.097v0.043H0.256C0.234 0.139 0.228 0.153 0.228 0.167V0.2H0.276L0.268 0.25H0.228V0.372A0.175 0.175 0 0 0 0.375 0.2z"/><path fill="#ffffff" d="M0.268 0.25 0.276 0.2H0.228V0.167c0 -0.014 0.007 -0.028 0.028 -0.028h0.022V0.097S0.258 0.093 0.239 0.093C0.199 0.093 0.172 0.117 0.172 0.161V0.2H0.128v0.05H0.172V0.372a0.176 0.176 0 0 0 0.054 0V0.25h0.041z"/></svg>
			Sign in with Facebook
		</button>
	)
}
