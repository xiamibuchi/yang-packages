// 获取两个日期之间所有日期
const dayDistance = 24 * 60 * 60 * 1000;
function getAll(begin, end) {
  const ab = begin.split('-');
  const ae = end.split('-');
  const db = new Date();
  db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  const de = new Date();
  de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  const unixDb = db.getTime();
  const unixDe = de.getTime();
  for (let k = unixDb; k <= unixDe; ) {
    const date = new Date(Number.parseInt(k));
    console.log(date);
    k = k + dayDistance;
  }
}

getAll('2017-02-27', '2017-03-02');

// 时间戳转换为时间
function timestampToTime(timestamp = Date.parse(new Date()), isMs = true) {
  const date = new Date(timestamp * (isMs ? 1 : 1000));
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// 日期按所传格式进行格式化
function formatDate(date, fmt) {
  const o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.slice(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.slice(`${o[k]}`.length)
      );
  return fmt;
}
