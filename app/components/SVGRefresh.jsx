import * as React from "react";
const SVGRefresh = (props) => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 0.4 0.4"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <title>{props.title || "Refresh"}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.117 0.075H0.05V0.05h0.088l0.013 0.013V0.15H0.125V0.1a0.125 0.125 0 1 0 0.113 -0.019l0.008 -0.024A0.15 0.15 0 1 1 0.117 0.075"
    />
  </svg>
);
export default SVGRefresh;
