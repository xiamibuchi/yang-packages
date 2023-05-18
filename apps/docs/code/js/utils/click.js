// 处理双击
function oneClick(event) {
  this.clicks++;
  if (this.clicks === 1) {
    this.timer = setTimeout(() => {
      this.result.push(event.type);
      this.clicks = 0;
    }, this.delay);
  } else {
    clearTimeout(this.timer);
    this.result.push('dblclick');
    this.clicks = 0;
  }
}
