export const isTouchScreen = () => {
  return window.matchMedia("(pointer: coarse)").matches;
};

export const isDarkMode = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const isLightMode = () => {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
};
