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
