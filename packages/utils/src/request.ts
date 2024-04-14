import { isServer } from './env';

export const toFormData = (data: any) => {
  const formData = isServer() ? new URLSearchParams() : new FormData();
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value === null || value === undefined) {
      continue;
    }
    if (typeof value === 'object' && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  }
  return formData;
};

export function getXff(xff: string, remoteAddress?: string) {
  if (!remoteAddress) {
    return xff;
  }
  const xffList = xff.split(',').map((x) => x.trim());
  xffList.push(remoteAddress);
  return xffList.join(', ');
}
