const nth = (d) => {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

const dateGetter = (timeStamp, timeHolder) => {
  const noDueDate = '[DD Mon, YYYY]';
  if (timeStamp === null) return noDueDate;
  const date = new Date(timeStamp);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const nthDay = nth(day);
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  if (timeHolder)
    return `${day}${nthDay} ${month}, ${year} ${time}`;
  return `${day}${nthDay} ${month}, ${year}`;
}
export default dateGetter;