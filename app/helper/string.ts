export const hashRegexp = /(#\w+)/g;

export const getAllHashTagText = (str: string): string[] => {
  // find all hashtag text
  return str.match(hashRegexp) ?? [];
};

export const urlRegex = /(https?:\/\/[^\s]+)/g;

export const getAllLinkText = (str: string): string[] => {
  return str.match(urlRegex) ?? [];
};
