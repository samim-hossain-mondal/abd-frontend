const getDBOffSetTime = (date) =>
  (new Date(date).getTimezoneOffset()) * 60 * 1000
// return new Date(new Date(date).getTime() + offset).toISOString()


export default getDBOffSetTime;