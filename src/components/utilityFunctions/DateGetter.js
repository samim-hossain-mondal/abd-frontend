const dateGetter = (timeStamp, timeHolder) => {
  const noDueDate = '[DD Mon, YYYY]';
  if (timeStamp === null) return noDueDate;
  const date = new Date(timeStamp);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  if (timeHolder)
    return `${day} ${month}, ${year} ${time}`;
  return `${day} ${month}, ${year}`;
}
export default dateGetter;