/**
 * @description Converts the first character of string to upper case and the remaining to lower case.
 */
export const capitalize = (str: string): string => {
  if (typeof str !== 'string') {
    return '';
  }
  if (!str || str.length === 0) {
    return '';
  }
  const lower = str.toLowerCase();
  return lower.substring(0, 1).toUpperCase() + lower.substring(1, lower.length);
};

/**
 * @description add 0 to the start if the length of the string is limit or the number is less than 10 * limit
 */
export const padStart = (str: string | number, limit = 1) => {
  if (!str) {
    return str;
  }
  if (typeof str === 'number') {
    return str < 10 * limit ? `0${str}` : str.toString();
  }
  return str.length <= limit ? `0${str}` : str;
};
