import React, { HTMLAttributes, ReactNode } from "react";
import { CloseCircleIcon } from "@/icons/CloseCircle";

type AlertProps = {
  variant: "error";
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Alert = ({ variant, children, ...props }: AlertProps) => {
  return (
    <div {...props}>
      <div role="alert" className={`alert alert-${variant}`}>
        <CloseCircleIcon />
        {children}
      </div>
    </div>
  );
};
