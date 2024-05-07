"use client"

const ScrollButton = ({ rotationDegree, isObservedElementVisible, bgColor, textColor, refe }) => {

  const scrollTo = () => {
    refe.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      disabled={isObservedElementVisible}
      onClick={scrollTo}
      className={`fixed bottom-4 scrollButton right-4 max-sm:right-3 max-sm:bottom-10 rounded-full  
        ${`${bgColor} ${textColor}` || "staticBgColor fontColor"} p-2 ${
        isObservedElementVisible ? "hide-button" : "show-button"
      }`}
    >
      <svg
        width="30px"
        height="30px"
        viewBox="0 0 1.8 1.8"
        xmlns="http://www.w3.org/2000/svg"
        className={`rotate-${rotationDegree || 0} `}
      >
        <path d="M0 0h1.8v1.8H0z" fill="none" />
        <g id="Shopicon">
          <path
            fill="currentColor"
            points="6.586,30.586 9.414,33.414 24,18.828 38.586,33.414 41.414,30.586 24,13.172  "
            d="M0.247 1.147L0.353 1.253L0.9 0.706L1.447 1.253L1.553 1.147L0.9 0.494Z"
          />
        </g>
      </svg>
    </button>
  )
}

export default ScrollButton