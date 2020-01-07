export const getRandomNum = maxVal => {
  maxVal = maxVal || 20;
  return Math.floor(Math.random() * maxVal) + 1;
};
