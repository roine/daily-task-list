export const findNextInArray = <T extends { id: string | number | Symbol }>(
  arr: T[],
  element: T,
) => {
  const index = arr.findIndex((obj) => obj.id === element.id);

  if (index === -1) {
    // Element not found in the array
    return null;
  }

  if (index === arr.length - 1) {
    // Element is the last one in the array
    return null;
  }

  // Return the next element
  return arr[index + 1];
};

export const findPreviousInArray = <T extends { id: string | number | Symbol }>(
  arr: T[],
  element: T,
) => {
  const index = arr.findIndex((obj) => obj.id === element.id);
  if (index === -1) {
    // Element not found in the array
    return null;
  }

  if (index === 0) {
    // Element is the first one in the array
    return null;
  }

  return arr[index - 1];
};
