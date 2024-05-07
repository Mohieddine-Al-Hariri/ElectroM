
const SVGTrash = (props) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 0.563 0.563"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>{props.title || "Delete"}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.206 0.037a0.019 0.019 0 0 0 0 0.037h0.15a0.019 0.019 0 0 0 0 -0.037h-0.15ZM0.112 0.131a0.019 0.019 0 0 1 0.019 -0.019h0.3a0.019 0.019 0 0 1 0 0.037H0.412v0.3a0.037 0.037 0 0 1 -0.037 0.037H0.188a0.037 0.037 0 0 1 -0.037 -0.037V0.15h-0.019a0.019 0.019 0 0 1 -0.019 -0.019ZM0.188 0.15h0.188v0.3H0.188V0.15Z"
      fill="currentColor"
    />
  </svg>
)

export default SVGTrash