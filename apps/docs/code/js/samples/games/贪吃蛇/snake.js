(function (window) {
  function Snake(options) {
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.headColor = options.headColor || 'red';
    this.bodyColor = options.bodyColor || 'yellow';
    this.map = options.map;

    this.direction = 'right';
    this.elements = [];

    //body数组中存储的是每一个小节的蛇相关的信息
    this.body = [
      { x: 3, y: 1, color: this.headColor },
      { x: 2, y: 1, color: this.bodyColor },
      { x: 1, y: 1, color: this.bodyColor },
    ];

    this.render();
  }

  Snake.prototype = {
    render() {
      //遍历存有每小节蛇的对象的数组
      //每个小节蛇 都包含 这个一小节蛇的 坐标 颜色
      for (let i = 0; i < this.body.length; i++) {
        const smallSnake = this.body[i];

        //为每一个小节的蛇，创建一个对应的div
        const div = document.createElement('div');

        //将当前小节蛇的元素保存到 this.elements数组中 方便以后操作
        this.elements.push(div);

        //下面的代码都是在设置这一节蛇对应的div的样式
        div.style.width = `${this.width}px`;
        div.style.height = `${this.height}px`;
        div.style.backgroundColor = smallSnake.color;

        //设置位置
        div.style.position = 'absolute';
        //根据当前小节蛇的坐标，计算当前蛇应该有的left和top
        div.style.left = `${smallSnake.x * this.width}px`;
        div.style.top = `${smallSnake.y * this.height}px`;

        this.map.appendChild(div);
      }
    },
    move(food) {
      //蛇身体移动的代码
      for (let i = this.body.length - 1; i > 0; i--) {
        const smallSnake = this.body[i];
        //将蛇身体的每个小关节，向前移动一个
        smallSnake.x = this.body[i - 1].x;
        smallSnake.y = this.body[i - 1].y;
        // [
        //     {x: 3, y: 1, color: this.headColor},
        //     {x: 3, y: 1, color: this.bodyColor},
        //     {x: 2, y: 1, color: this.bodyColor}
        // ]
      }

      //蛇头移动的代码
      //根据移动的方向不同，需要将蛇头的坐标进行对应的更改
      switch (this.direction) {
        case 'right':
          //向右 让x++
          this.body[0].x++;
          break;
        case 'left':
          //向左 让x--
          this.body[0].x--;
          break;
        case 'up':
          //向上 让y--
          this.body[0].y--;
          break;
        case 'down':
          //向下 让y++
          this.body[0].y++;
          break;
      }

      //判断蛇移动之后，是否吃到了食物
      //判断蛇头的位置和食物的位置是否重合
      if (this.body[0].x == food.x && this.body[0].y == food.y) {
        //让蛇身体增加一个小方块
        this.body.push({
          x: this.body[this.body.length - 1].x,
          y: this.body[this.body.length - 1].y,
          color: this.bodyColor,
        });
        //食物换一个位置显示
        food.render();
      }

      //将之前显示出来的蛇删掉
      //删除map中的蛇对应的div
      for (let j = 0; j < this.elements.length; j++) {
        this.map.removeChild(this.elements[j]);
      }
      //存储所有div的数组，清空
      this.elements = [];

      // this.x < 0  this.x > this.map.offsetWidth / this.width
      // this.y < 0  this.y > this.map.offsetHeight / this.height

      this.render();
    },
  };

  window.Snake = Snake;
})(window);
