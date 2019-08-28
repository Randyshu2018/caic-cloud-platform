import moment from 'moment';

/**
 * 格式化日期
 * eg. https://momentjs.com/docs/#/parsing/string-format/
 * @param date {Date | string}
 * @param template {string}
 * @return {string}
 */
export function format(date, template = 'YYYY-MM-DD') {
  return moment(date).format(template);
}
