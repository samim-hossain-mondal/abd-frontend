/* eslint-disable no-param-reassign */
import dateGetter from './DateGetter';

export const isSameDay = (date1, date2) => {
  if (date1 instanceof Date && date2 instanceof Date) {
    return date1.getDate() === date2.getDate()
      && date1.getMonth() === date2.getMonth()
      && date1.getFullYear() === date2.getFullYear();
  }
  return false;
};

export const isYesterday = (date1) => {
  if (date1 instanceof Date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.getDate() === date1.getDate()
      && yesterday.getMonth() === date1.getMonth()
      && yesterday.getFullYear() === date1.getFullYear();
  }
  return false;
};

export const isToday = (date1) => {
  if (date1 instanceof Date) {
    const today = new Date();
    return today.getDate() === date1.getDate()
      && today.getMonth() === date1.getMonth()
      && today.getFullYear() === date1.getFullYear();
  }
  return false;
};

export const getDateGroupName = (date, previousRequestDate) => {
  if (previousRequestDate) {
    if (!isSameDay(date, previousRequestDate)) {
      if (isYesterday(date)) {
        return "Yesterday";
      }
      return dateGetter(date);
    }
  }
  else {
    if (isToday(date)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return dateGetter(date)
  }
  return null;
};

export const groupByDate = (items) => items.reduce((result, item) => {
  const date = new Date(item.createdAt);
  const dateGroupName = getDateGroupName(date);
  if (!result[dateGroupName]) {
    result[dateGroupName] = [];
  }
  result[dateGroupName].push(item);
  return result;
}, {})
