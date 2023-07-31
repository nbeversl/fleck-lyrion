function secondsToMinutes(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;
  return (
    "" +
    minutes +
    ":" +
    remainingSeconds.toLocaleString("en", {
      minimumIntegerDigits: 2,
    })
  );
}

export default secondsToMinutes;
