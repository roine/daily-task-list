import React from "react";

type SelfPositioningTooltipProps = React.HTMLAttributes<HTMLDivElement>;

export const SelfPositioningTooltip = ({
  children,
  ...props
}: SelfPositioningTooltipProps) => {
  return (
    <div
      {...props}
      className="lg:tooltip lg:tooltip-open"
      onMouseOver={(e) => {
        if (e.currentTarget === e.target) {
          return;
        }
        const target = e.target as HTMLElement;

        const threshold = 40;

        if (
          window.innerHeight - target.getBoundingClientRect().bottom <
          threshold
        ) {
          target.parentElement?.classList.add("lg:tooltip-top");
          target.parentElement?.classList.remove("lg:tooltip-bottom");
        } else {
          target.parentElement?.classList.remove("lg:tooltip-top");
          target.parentElement?.classList.add("lg:tooltip-bottom");
        }
      }}
    >
      {children}
    </div>
  );
};
