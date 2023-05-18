(function (window) {
  function Food(options) {
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.color = options.color;
    this.x = 0;
    this.y = 0;
    this.map = options.map;
    //因为食物最终是要显示到地图上的，显示到地图上的东西其实就是div
    //所以在这里，我们创建一个div，用这个div来代表食物
    this.element = document.createElement('div');
    this.init();
  }

  Food.prototype = {
    //将在对象创建完成之后要做的所有的工作，全部封装到这个函数中
    //避免将其直接放在构造函数中，导致构造函数中的代码结果过于混乱的问题！
    init() {
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;
      this.element.style.backgroundColor = this.color;
      this.render();
    },
    render() {
      //求一个随机的x值： x >=0 && x <= 每行的格子数量
      this.x = window.Utils.getRandom(0, window.map.offsetWidth / this.width);
      this.y = window.Utils.getRandom(0, window.map.offsetHeight / this.height);
      this.element.style.position = 'absolute';

      this.element.style.left = `${this.x * this.width}px`;
      this.element.style.top = `${this.y * this.height}px`;

      this.map.appendChild(this.element);
    },
  };

  window.Food = Food;
})(window);
