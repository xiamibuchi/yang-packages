// 缓慢滚动
export function scrollToTop() {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, scrollTop - scrollTop / 8);
  } else {
    window.cancelAnimationFrame(scrollToTop);
  }
}
