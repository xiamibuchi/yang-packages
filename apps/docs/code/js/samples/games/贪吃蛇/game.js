(function (window) {
  function Game(map) {
    this.map = map;
    this.food = new window.Food({
      color: 'yellowgreen',
      map: this.map,
    });
    this.snake = new window.Snake({
      map: this.map,
    });

    this.bindKeyEvent();
  }

  Game.prototype = {
    startGame() {
      //由于在下面的函数中要使用当前函数中的this
      //但是下面的函数中有自己的this，如果直接用this，是访问不到我们这个函数中的this的
      //所以我们声明一个新的变量that 将当前函数中的this赋值给这个that
      //that和this的值就是相同的了
      //在下面的函数中我们就可以使用that来访问到当前函数中的this了！
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;

      const timer = setInterval(() => {
        // console.log(this);
        that.snake.move(that.food);
        if (
          that.snake.body[0].x < 0 ||
          that.snake.body[0].x >= that.map.offsetWidth / that.snake.width ||
          that.snake.body[0].y < 0 ||
          that.snake.body[0].y >= that.map.offsetHeight / that.snake.height
        ) {
          //出界了
          clearInterval(timer);
          alert('Game Over');
        }

        for (let i = 3; i < that.snake.body.length; i++) {
          const smallSnake = that.snake.body[i];
          if (
            that.snake.body[0].x == smallSnake.x &&
            that.snake.body[0].y == smallSnake.y
          ) {
            clearInterval(timer);
            alert('Game Over');
          }
        }
      }, 200);
    },
    bindKeyEvent() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      document.onkeyup = function (e) {
        // console.log(e.keyCode);
        switch (e.keyCode) {
          case 37:
            //左
            if (that.snake.direction != 'right') {
              that.snake.direction = 'left';
            }
            break;
          case 38:
            //上
            if (that.snake.direction != 'down') {
              that.snake.direction = 'up';
            }
            break;

          case 39:
            //右
            if (that.snake.direction != 'left') {
              that.snake.direction = 'right';
            }
            break;

          case 40:
            //下
            if (that.snake.direction != 'up') {
              that.snake.direction = 'down';
            }
            break;
        }
      };
    },
  };

  window.Game = Game;
})(window);

// function test(){
//     var a = 10;
//     this
//     var that = this;
//     function func(){
//         var a = 100;
//         that
//         console.log(a);
//     }

//     func();
// }

// test();

// var a = 10;

// var obj = {
//     a: 10
// }

// console.log(obj.a);
