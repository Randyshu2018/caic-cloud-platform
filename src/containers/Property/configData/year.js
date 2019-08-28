/**
 * 获取以当前年为中心，取前n年及后n年年份数据
 *
 * @param {Number} year
 * @param {Number} count 比如前两年后两年，则传入2
 * @param {Array} return
 */
export default function dataYear(year, count = 2) {
  const y = Math.floor(year) ? year : new Date().getFullYear();
  let i = count * 2;
  const yArr = new Array(i + 1);
  while (i > -1) {
    const num = count > i ? i - count : -(count - i);
    yArr[i] = y + num;
    i -= 1;
  }
  return yArr;
}

export function dataYear2(year, count = 2) {
  const y = Math.floor(year) ? year : new Date().getFullYear();
  let i = count;
  const yArr = new Array(i + 1);
  while (i > -1) {
    yArr[i] = y + (i - count);
    i -= 1;
  }
  return yArr;
}
