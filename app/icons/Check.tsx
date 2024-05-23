import React from "react";

export const CheckIcon = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-label="Check icon"
    >
      <path
        d="M13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9L13 24z"
        fill="currentColor"
      ></path>
    </svg>
  );
};
