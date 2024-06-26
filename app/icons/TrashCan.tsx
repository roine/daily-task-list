import React from "react";

export const TrashCanIcon = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      aria-label="Trash can icon"
    >
      <path d="M12 12h2v12h-2z" fill="currentColor"></path>
      <path d="M18 12h2v12h-2z" fill="currentColor"></path>
      <path
        d="M4 6v2h2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8h2V6zm4 22V8h16v20z"
        fill="currentColor"
      ></path>
      <path d="M12 2h8v2h-8z" fill="currentColor"></path>
    </svg>
  );
};
