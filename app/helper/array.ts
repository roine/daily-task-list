export const findNextInArray = <T extends {}>(
  arr: readonly T[],
  element: T,
  option?: { trackBy?: keyof T; cycle?: boolean },
): T | null => {
  let index;

  const trackBy = option?.trackBy;
  const cycle = option?.cycle;

  if (typeof element === "object" && trackBy != null) {
    index = arr.findIndex((obj) => obj[trackBy] === element[trackBy]);
  } else {
    index = arr.findIndex((obj) => obj === element);
  }

  if (index === -1) {
    // Element not found in the array
    return null;
  }

  if (index === arr.length - 1) {
    if (cycle) {
      return arr[0];
    }
    // Element is the last one in the array
    return null;
  }

  // Return the next element
  return arr[index + 1];
};

export const findPreviousInArray = <T extends {}>(
  arr: readonly T[],
  element: T,
  option?: { trackBy?: keyof T; cycle?: boolean },
): T | null => {
  let index;

  const trackBy = option?.trackBy;
  const cycle = option?.cycle;

  if (typeof element === "object" && trackBy != null) {
    index = arr.findIndex((obj) => obj[trackBy] === element[trackBy]);
  } else {
    index = arr.findIndex((obj) => obj === element);
  }

  if (index === -1) {
    // Element not found in the array
    return null;
  }

  if (index === 0) {
    if (cycle) {
      return arr[arr.length - 1];
    }
    // Element is the first one in the array
    return null;
  }

  return arr[index - 1];
};
