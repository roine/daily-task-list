import React, { useRef } from "react";

export const useOnTap = ({ onTap }: { onTap: () => void }) => {
  const dragDistance = useRef<[number, number] | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    dragDistance.current = [e.touches[0].clientX, e.touches[0].clientY];
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (dragDistance.current) {
      const [startX, startY] = dragDistance.current;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 1) {
        console.log(e.currentTarget);
        e.preventDefault();
        // no drag just a tap
        onTap();
      }
    }
  };
  return {
    onTouchStart,
    onTouchEnd,
  };
};
