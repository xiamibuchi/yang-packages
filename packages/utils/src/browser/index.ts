const UA = (exp: RegExp, ua: string): boolean => {
  return exp.test(ua);
};

export const isAndroid = (ua: string) => UA(/android/i, ua);
export const isPad = (ua: string) => UA(/iPad/i, ua);
export const isiOS = (ua: string) => UA(/iPhone|iPad|iPod/i, ua);
export const isMobileDevice = (ua: string) => /(mobi|mzbrowser)/i.test(ua);
export const isMobile = (ua: string) =>
  !isPad(ua) && (isMobileDevice(ua) || isAndroid(ua) || isiOS(ua));
export const isWechat = (ua: string) => UA(/MicroMessenger|WindowsWechat/i, ua);
export const isAlipay = (ua: string) => UA(/AlipayClient/i, ua);
