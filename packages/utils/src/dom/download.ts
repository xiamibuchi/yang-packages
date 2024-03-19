export const downloadAnchor = (url: string, name?: string) => {
  const link: HTMLAnchorElement = document.createElement('a');
  if (name) {
    link.download = name;
  }
  link.href = url;
  link.click();
  link.remove();
};

export const image2base64 = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const mime = img.src
    .slice(Math.max(0, img.src.lastIndexOf('.') + 1))
    .toLowerCase();
  const dataUrl = canvas.toDataURL(`image/${mime}`);
  return dataUrl;
};

export const downloadImage = (url: string, name?: string) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  img.onload = () => {
    const dataUrl = image2base64(img);
    downloadAnchor(dataUrl, name);
  };
};

export const downloadBlob = (link: string, name?: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', link, true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    const url = URL.createObjectURL(xhr.response);
    downloadAnchor(url, name);
    URL.revokeObjectURL(url);
  };
  xhr.send();
};
