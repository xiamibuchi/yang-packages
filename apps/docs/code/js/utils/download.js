function image2base64(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const mime = img.src
    .slice(Math.max(0, img.src.lastIndexOf('.') + 1))
    .toLowerCase();
  const dataUrl = canvas.toDataURL(`image/${mime}`);
  return dataUrl;
}

function downloadByAnchor(url, name) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  return anchor;
}

export function download(value, name, type) {
  const image = new Image();
  let objectURL = null;
  switch (type) {
    case 'img':
      image.setAttribute('crossOrigin', 'Anonymous');
      image.src = `${value}?${Date.now()}`;
      image.onload = function () {
        const imageDataUrl = image2base64(image);
        downloadByAnchor(imageDataUrl, name);
      };
      break;
    case 'binary':
      if (!('download' in document.createElement('a'))) {
        // IE10+下载
        return navigator.msSaveBlob(value, name);
      }
      objectURL = window.URL.createObjectURL(new Blob([value]));
      downloadByAnchor(objectURL, name);
      URL.revokeObjectURL(objectURL);
      break;
    case 'file':
      downloadByAnchor(value, name);
      break;
    default:
      window.open(value);
  }
}

// 下载csv
export function handleDownload() {
  const values = [
    {
      id: 1,
      name: '1',
    },
    {
      id: 2,
      name: '2',
    },
  ];
  const HEADERS = ['header1', 'header2'];
  const CSV_STR = `${HEADERS.join(',')}\n${values.reduce((result, ele) => {
    result += `${Object.values(ele).join(',\t')}\n`; // 如需保证csv顺序，按照字段顺序排列
    return result;
  }, '')}`;

  const blob = new Blob([CSV_STR], {
    type: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  });

  const URI = window.URL.createObjectURL(blob);
  const FILE_NAME = '文件流下载' + '.csv';
  let anchor = document.createElement('a');
  anchor.href = URI;
  anchor.setAttribute('download', FILE_NAME);
  anchor.click();
  anchor = null;
}
