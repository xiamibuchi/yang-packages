import fs from 'node:fs';

export const isFile = (path: string): boolean => {
  const stat = fs.statSync(path, { throwIfNoEntry: false });
  return stat !== undefined && (stat.isFile() || stat.isFIFO());
};
