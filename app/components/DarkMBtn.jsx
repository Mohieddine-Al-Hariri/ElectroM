"use client"

import { useEffect, useState } from "react";
const DarkModeButton = ( {isDarkMode, setIsDarkMode} ) => { 
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    const isDarkModeLocal = JSON.parse(localStorage.getItem("isDarkMode"))
    setIsDarkMode(isDarkModeLocal);
  },[])
  const toggleDarkMode = async () => {
    
    const isDark = !isDarkMode; //Since the state won't update until the next render
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", JSON.stringify(isDark));
    document.body.classList.toggle('dark')
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    cursor: 'pointer',
  };


  return (
    <button onMouseOver={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className='flex items-center py-[10px] px-[20px] rounded-md hover:shadow-black shadow-inner darkModebtnBg hover:border-black border-solid border-1 cursor-pointer transition duration-200' onClick={toggleDarkMode}>
      {!isDarkMode ? (
        <>
        {!isHover? 
          <svg width="20px" height="20px" viewBox="0 0 0.6 0.6" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0.3 0.05a0.025 0.025 0 0 1 0.025 0.025v0.025a0.025 0.025 0 1 1 -0.05 0V0.075A0.025 0.025 0 0 1 0.299 0.05zm0.177 0.073a0.025 0.025 0 0 1 0 0.035L0.459 0.177A0.025 0.025 0 1 1 0.423 0.141L0.441 0.123a0.025 0.025 0 0 1 0.035 0zm-0.353 0a0.025 0.025 0 0 1 0.035 0l0.018 0.018a0.025 0.025 0 0 1 -0.036 0.035L0.123 0.158a0.025 0.025 0 0 1 0 -0.035zM0.3 0.2a0.1 0.1 0 1 0 0 0.2 0.1 0.1 0 0 0 0 -0.2zM0.15 0.3a0.15 0.15 0 1 1 0.3 0 0.15 0.15 0 0 1 -0.3 0zm-0.1 0A0.025 0.025 0 0 1 0.075 0.275h0.025a0.025 0.025 0 1 1 0 0.05H0.075A0.025 0.025 0 0 1 0.05 0.301zm0.425 0A0.025 0.025 0 0 1 0.499 0.275h0.025a0.025 0.025 0 1 1 0 0.05H0.499A0.025 0.025 0 0 1 0.475 0.301zM0.141 0.424a0.025 0.025 0 0 1 0.035 0.035L0.158 0.477A0.025 0.025 0 0 1 0.123 0.442L0.141 0.424zm0.283 0.035A0.025 0.025 0 0 1 0.459 0.424l0.018 0.018a0.025 0.025 0 0 1 -0.035 0.035L0.423 0.459zM0.3 0.475A0.025 0.025 0 0 1 0.325 0.5v0.025a0.025 0.025 0 1 1 -0.05 0V0.5A0.025 0.025 0 0 1 0.299 0.475z"/></svg>
        : 
        <svg fill="currentColor" className="" width="20px" height="20px" viewBox="0 0 4.75 4.75" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" enableBackground="new 0 0 75.99 75.99" xmlSpace="preserve" >
          <path fill="currentColor" fillOpacity="1" strokeWidth="0.012500000000000002" strokeLinejoin="round" d="M2.572 3.815A1.485 1.485 0 0 1 2.21 0.89a1.48 1.48 0 0 0 -0.43 1.045 1.485 1.485 0 0 0 1.848 1.44 1.48 1.48 0 0 1 -1.055 0.44Z"/>
        </svg>
        }
        </>
      ) : (
        <>
        {!isHover?
          <svg fill="currentColor" className="" width="20px" height="20px" viewBox="0 0 4.75 4.75" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" enableBackground="new 0 0 75.99 75.99" xmlSpace="preserve" >
            <path fill="currentColor" fillOpacity="1" strokeWidth="0.012500000000000002" strokeLinejoin="round" d="M2.572 3.815A1.485 1.485 0 0 1 2.21 0.89a1.48 1.48 0 0 0 -0.43 1.045 1.485 1.485 0 0 0 1.848 1.44 1.48 1.48 0 0 1 -1.055 0.44Z"/>
          </svg>
          :
          <svg width="20px" height="20px" viewBox="0 0 0.6 0.6" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0.3 0.05a0.025 0.025 0 0 1 0.025 0.025v0.025a0.025 0.025 0 1 1 -0.05 0V0.075A0.025 0.025 0 0 1 0.299 0.05zm0.177 0.073a0.025 0.025 0 0 1 0 0.035L0.459 0.177A0.025 0.025 0 1 1 0.423 0.141L0.441 0.123a0.025 0.025 0 0 1 0.035 0zm-0.353 0a0.025 0.025 0 0 1 0.035 0l0.018 0.018a0.025 0.025 0 0 1 -0.036 0.035L0.123 0.158a0.025 0.025 0 0 1 0 -0.035zM0.3 0.2a0.1 0.1 0 1 0 0 0.2 0.1 0.1 0 0 0 0 -0.2zM0.15 0.3a0.15 0.15 0 1 1 0.3 0 0.15 0.15 0 0 1 -0.3 0zm-0.1 0A0.025 0.025 0 0 1 0.075 0.275h0.025a0.025 0.025 0 1 1 0 0.05H0.075A0.025 0.025 0 0 1 0.05 0.301zm0.425 0A0.025 0.025 0 0 1 0.499 0.275h0.025a0.025 0.025 0 1 1 0 0.05H0.499A0.025 0.025 0 0 1 0.475 0.301zM0.141 0.424a0.025 0.025 0 0 1 0.035 0.035L0.158 0.477A0.025 0.025 0 0 1 0.123 0.442L0.141 0.424zm0.283 0.035A0.025 0.025 0 0 1 0.459 0.424l0.018 0.018a0.025 0.025 0 0 1 -0.035 0.035L0.423 0.459zM0.3 0.475A0.025 0.025 0 0 1 0.325 0.5v0.025a0.025 0.025 0 1 1 -0.05 0V0.5A0.025 0.025 0 0 1 0.299 0.475z"/></svg>
        }

        </>
      )}
    </button>
  );
}
export default DarkModeButton