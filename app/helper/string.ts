export const hashRegexp = /(#\w+)/g;

export const getAllHashTagText = (str: string): string[] => {
  // find all hashtag text
  return str.match(hashRegexp) ?? [];
};
