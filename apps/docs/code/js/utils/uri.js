// 获取url中的参数
export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.slice(1).match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

// 获取url中的参数
export function getQueryString1(name) {
  const query = window.location.search.slice(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === name) {
      return pair[1];
    }
  }
  return false;
}

// 获取url中的参数
export function getQueryString2(name) {
  const parsedUrl = new URL(window.location.href);
  return parsedUrl.searchParams.get(name);
}
