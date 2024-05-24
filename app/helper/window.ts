export const getMetaSymbolForOS = () => {
  if (typeof window === "undefined") {
    return "";
  }
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("win")) {
    return "⊞";
  }
  if (userAgent.includes("mac")) {
    return "⌘";
  }
  if (userAgent.includes("x11") || userAgent.includes("linux")) {
    return "Meta key";
  }
  return "";
};
