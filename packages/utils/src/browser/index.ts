const UA = (exp: RegExp, ua: string): boolean => {
  return exp.test(ua);
};

export const isAndroid = (ua: string) => UA(/android/i, ua);
export const isiOS = (ua: string) => UA(/iPhone|iPad|iPod/i, ua);
export const isWechat = (ua: string) => UA(/MicroMessenger|WindowsWechat/i, ua);
