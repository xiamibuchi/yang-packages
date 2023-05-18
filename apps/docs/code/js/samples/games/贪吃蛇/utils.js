(function (window) {
  const Utils = {
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  };

  window.Utils = Utils;
})(window);
