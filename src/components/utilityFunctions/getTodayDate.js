const getTodayDate = () => {
  const todayDate = new Date()
  const day = todayDate.getDate();
  const month = todayDate.getMonth() + 1 < 10 ? `0${todayDate.getMonth() + 1}` : todayDate.getMonth() + 1;
  const year = todayDate.getFullYear();
  return `${year}-${month}-${day}`;
}

export default getTodayDate;