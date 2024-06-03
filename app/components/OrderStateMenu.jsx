"use client"
import { publishOrder, updateOrderState } from '@/lib';
import { useEffect, useRef } from 'react';
import { SVGCancel, SVGTrash, SVGX } from '.';
import { useRouter } from 'next/navigation';

export const StateBtn = ({ changeOrderState, state, setIsOpen, svg, orderState }) => {
  return(
    <button 
      disabled={state === orderState} 
      onClick={() => {changeOrderState(state); setIsOpen(false)}}  
      className={`px-4 py-2 rounded-md  hover:text-white ${
        state === orderState ? "text-white bg-secondaryColor" : " fontColor hover:bg-primaryColor"
      }
        flex w-full justify-between `}
    >
      {state}
      {svg}
    </button>
  )
} 

const OrderStateMenu = ({ isOpen, setIsOpen, orderState, setOrderState, orderId, handleDeleteOrder }) => {
  // Ref for the card menu container
  const cardMenuRef = useRef(null);
  const router = useRouter();

  // Handle click outside the card menu
  const handleClickOutside = (event) => {
    if (cardMenuRef.current && !cardMenuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Add click event listener when the component mounts
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const changeOrderState = async (state) => {
    const updatedOrder = await updateOrderState({orderId, state});
    await publishOrder(orderId);
    setOrderState(updatedOrder.updateOrder.state);
    router.refresh();
  }

  const states = [
    {state: 'Ordered', 
    svg: <svg
      width="24px"
      height="24px"
      viewBox="0 0 0.9 0.9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity={0.4}
        d="M0.45 0.637v0.089c0 0.07 -0.028 0.098 -0.099 0.098H0.173C0.103 0.825 0.075 0.797 0.075 0.727v-0.178C0.075 0.478 0.103 0.45 0.173 0.45H0.263v0.089C0.263 0.609 0.291 0.637 0.361 0.637H0.45Z"
        stroke="#292D32"
        strokeWidth={0.056249999999999994}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.637 0.45v0.089c0 0.07 -0.028 0.099 -0.099 0.099H0.361C0.291 0.637 0.263 0.609 0.263 0.539V0.361C0.263 0.291 0.291 0.263 0.361 0.263H0.45v0.089c0 0.07 0.028 0.099 0.098 0.099H0.637Z"
        stroke="#292D32"
        strokeWidth={0.056249999999999994}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.825 0.173v0.178c0 0.07 -0.028 0.099 -0.099 0.099h-0.178C0.478 0.45 0.45 0.422 0.45 0.351V0.173C0.45 0.103 0.478 0.075 0.548 0.075h0.178C0.797 0.075 0.825 0.103 0.825 0.173Z"
        stroke="#292D32"
        strokeWidth={0.056249999999999994}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    }, {state: 'Delivering',
    svg: <svg
      fill="currentColor"
      width="24px"
      height="24px"
      viewBox="0 0 1.875 1.875"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path d="M0.15 0.075a0.037 0.037 0 0 0 -0.037 0.037v0.375H0.075a0.037 0.037 0 0 0 -0.037 0.037v0.375a0.037 0.037 0 1 0 0 0.075h0.325c-0.156 0.103 -0.21 0.251 -0.21 0.251a0.037 0.037 0 0 0 0.025 0.048l0.082 0.023A0.261 0.261 0 0 0 0.225 1.425c0 0.145 0.118 0.263 0.263 0.263s0.263 -0.118 0.263 -0.263h0.452c0.004 0.037 0.016 0.064 0.035 0.084 0.025 0.025 0.056 0.029 0.076 0.029 0.008 0 0.016 -0.002 0.023 -0.005A0.263 0.263 0 0 0 1.575 1.688c0.145 0 0.263 -0.118 0.263 -0.263 0 -0.03 -0.006 -0.059 -0.015 -0.086 0.013 -0.004 0.028 -0.011 0.038 -0.024 0.011 -0.015 0.015 -0.033 0.015 -0.05 0 -0.018 -0.005 -0.033 -0.014 -0.054a0.248 0.248 0 0 0 -0.047 -0.07c-0.042 -0.045 -0.113 -0.084 -0.217 -0.089 -0.002 -0.206 -0.104 -0.369 -0.168 -0.453 0.011 -0.002 0.022 -0.004 0.031 -0.008 0.019 -0.007 0.035 -0.02 0.045 -0.036 0.019 -0.031 0.015 -0.061 0.015 -0.086 0 -0.025 0.004 -0.055 -0.015 -0.086 -0.01 -0.016 -0.026 -0.029 -0.045 -0.036 -0.019 -0.007 -0.04 -0.01 -0.066 -0.01 -0.052 0 -0.099 0.011 -0.137 0.032 -0.02 0.011 -0.037 0.026 -0.05 0.043A0.037 0.037 0 0 0 1.2 0.412h-0.188a0.037 0.037 0 1 0 0 0.075h0.178c0.002 0.01 0.006 0.019 0.011 0.028a0.037 0.037 0 0 0 -0.001 0.016c0.036 0.201 0.027 0.411 -0.026 0.567 -0.026 0.078 -0.063 0.142 -0.107 0.185C1.024 1.327 0.973 1.35 0.91 1.35c-0.042 0 -0.076 -0.028 -0.089 -0.096 -0.013 -0.068 0.002 -0.172 0.074 -0.298a0.037 0.037 0 0 0 0.002 -0.005c0.014 -0.004 0.028 -0.01 0.04 -0.017 0.018 -0.011 0.038 -0.03 0.038 -0.058a0.17 0.17 0 0 0 -0.018 -0.075 0.109 0.109 0 0 0 -0.023 -0.032c-0.01 -0.01 -0.026 -0.019 -0.044 -0.019H0.535c-0.004 0 -0.007 0.001 -0.011 0.001V0.563h0.037a0.037 0.037 0 0 0 0.037 -0.037V0.112a0.037 0.037 0 0 0 -0.037 -0.037H0.15zm0.037 0.075h0.337v0.337H0.188V0.15zm1.206 0.263a0.037 0.037 0 0 0 0 0c0.02 0 0.033 0.003 0.04 0.005 0.006 0.002 0.006 0.003 0.007 0.004 0.002 0.003 0.004 0.02 0.004 0.047 0 0.027 -0.002 0.044 -0.004 0.047 -0.001 0.001 -0.001 0.002 -0.007 0.005s-0.019 0.005 -0.04 0.005a0.248 0.248 0 0 1 -0.057 -0.006l-0.001 0 -0.029 -0.01c-0.005 -0.002 -0.01 -0.004 -0.014 -0.006 -0.023 -0.013 -0.03 -0.026 -0.03 -0.034 0 -0.008 0.007 -0.02 0.03 -0.033 0.023 -0.013 0.06 -0.023 0.1 -0.023zM0.112 0.563h0.337v0.31c0 0.001 0 0.002 0 0.004 0 0.001 0 0.001 0 0.002V0.9H0.112v-0.337zm1.166 0.016 0.003 0.001c0.01 0.004 0.02 0.007 0.03 0.01l0.016 0.005c0.008 0.008 0.188 0.201 0.191 0.46 -0.156 0.024 -0.296 0.141 -0.316 0.295h-0.101c0.006 -0.005 0.013 -0.007 0.018 -0.012 0.056 -0.054 0.097 -0.129 0.126 -0.215 0.052 -0.156 0.059 -0.352 0.032 -0.545zm-0.737 0.247h0.342c0.001 0.002 0.004 0.004 0.006 0.009 0.005 0.01 0.007 0.024 0.008 0.035 -0.007 0.004 -0.022 0.01 -0.042 0.015 -0.04 0.009 -0.1 0.015 -0.165 0.015 -0.065 0 -0.113 -0.006 -0.141 -0.015 -0.014 -0.004 -0.022 -0.009 -0.024 -0.011 0 -0.012 0.004 -0.028 0.009 -0.039a0.039 0.039 0 0 1 0.006 -0.009zM0.532 0.975h0.149c0.004 0 0.007 0 0.011 0 0.004 0 0.007 0 0.011 0h0.105c-0.053 0.113 -0.075 0.215 -0.06 0.293 0.006 0.032 0.019 0.058 0.035 0.082h-0.065L0.243 1.214c0.02 -0.047 0.085 -0.18 0.289 -0.239zM1.575 1.125c0.098 0 0.152 0.033 0.184 0.067 0.016 0.017 0.027 0.035 0.033 0.049 0.006 0.014 0.008 0.028 0.008 0.024 0 0.003 0 0.002 0 0.002 -0.007 0.001 -0.03 0 -0.06 -0.005 -0.062 -0.009 -0.156 -0.024 -0.254 0.016a0.037 0.037 0 0 0 0 0c-0.084 0.034 -0.124 0.091 -0.146 0.134 -0.011 0.021 -0.019 0.039 -0.024 0.046 -0.005 0.008 -0.001 0.004 -0.003 0.004 -0.011 0 -0.017 -0.001 -0.022 -0.006 -0.005 -0.005 -0.015 -0.022 -0.015 -0.068 0.002 -0.055 0.023 -0.105 0.057 -0.147C1.389 1.172 1.482 1.125 1.575 1.125zM0.331 1.318l0.085 0.024C0.392 1.363 0.375 1.391 0.375 1.425c0 0.062 0.051 0.112 0.112 0.112s0.112 -0.051 0.112 -0.112c0 -0.013 -0.01 -0.023 -0.015 -0.035l0.089 0.025c0 0.003 0.001 0.006 0.001 0.009 0 0.104 -0.083 0.188 -0.188 0.188s-0.188 -0.083 -0.188 -0.188c0 -0.035 0.01 -0.068 0.027 -0.097a0.037 0.037 0 0 0 0.005 -0.011zm1.298 0.01c0.036 0 0.069 0.005 0.1 0.009 0.004 0.001 0.008 0.001 0.012 0.002A0.187 0.187 0 0 1 1.575 1.613a0.187 0.187 0 0 1 -0.181 -0.141c0.004 -0.009 0.008 -0.017 0.013 -0.026 0.015 -0.029 0.033 -0.059 0.075 -0.083A0.111 0.111 0 0 0 1.462 1.425c0 0.062 0.051 0.112 0.112 0.112s0.112 -0.051 0.112 -0.112c0 -0.042 -0.024 -0.079 -0.058 -0.098zM0.487 1.387c0.021 0 0.037 0.016 0.037 0.037s-0.016 0.037 -0.037 0.037 -0.037 -0.016 -0.037 -0.037 0.016 -0.037 0.037 -0.037zm1.087 0c0.021 0 0.037 0.016 0.037 0.037s-0.016 0.037 -0.037 0.037 -0.037 -0.016 -0.037 -0.037 0.016 -0.037 0.037 -0.037z" />
    </svg>  
  }, {state: 'Recieved',
    svg: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  }, {state: 'Cancelled',
      svg: <SVGCancel/>
  }];

  const statesBtns = states.map((state) => {
    let bg = "bgColor";
    let disable = false;
    let txtClr = "fontColor";
    if(state.state === orderState){
      bg = "bg-[#2482c8]";
      disable = true;
      txtClr = "text-white"
    }
    return <StateBtn 
      key={state.state} 
      state={state.state} 
      orderState={orderState}
      changeOrderState={changeOrderState} 
      svg={state.svg} 
      setIsOpen={setIsOpen} 
    />
  })


  return (
    <div 
      ref={cardMenuRef}
      className="absolute w-48 h-10 bgColorGray fontColor rounded-t-md right-2 -top-20 mb-10 pt-1 pr-1 "
    >
      <div className=''>
        <div className='w-full flex justify-end'>
          <button
            className="p-1 fontColorGray hover:text-gray-100 hover:bg-primaryColor rounded-full focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <SVGX />
          </button>
        </div>

        <div className="absolute bgColorGray right-0 w-48 fontColor bgColor rounded-md shadow-lg z-10">
          <ul>
            {statesBtns}
            <button onClick={() => handleDeleteOrder(orderId)}  className={`px-4 py-2 rounded-md hover:bg-red-500 text-red-500 hover:text-white flex w-full justify-between `}>
              Delete
              <SVGTrash width="30px" height="30px" />
            </button>
          </ul>
        </div>
      </div>
    
    </div>
  );
};

export default OrderStateMenu;
