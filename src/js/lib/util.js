/**
 * Returns semi-random integer between 1 and maxVal
 * @param {Int} maxVal 
 * @returns {Int}
 */
export const getRandomNum = (maxVal = 20) => {
  return Math.floor(Math.random() * maxVal) + 1;
};

/**
 * Resolves after durationMs milliseconds
 * @param {Int} durationMs 
 * @returns {Promise}
 */
export const gameplayWait = durationMs => {
  return new Promise(resolve => {
    setTimeout(() => {
      window.requestAnimationFrame(resolve);
    }, durationMs);
  });
};