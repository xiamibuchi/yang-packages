//图片加载失败保底图
const BASE64_BLANK_IMG =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const DEFAULT_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 0,
};

// TODO 优化 1. 一个页面只需要一个监听器，监听多个图片 2. 一个图片只需要监听一次 3. 为了适配图片懒加载，需要监听图片的 src 变化 4. 如果图片已经加载过，不需要再次监听 5. 为了使用上的便捷，需要允许多个监听器存在
// const ListenerQueue = [];

export const lazyLoadImg = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const { target } = entry;
        if (target === img) {
          img.src = (img.dataset.src as string) || BASE64_BLANK_IMG;
        }
        observer.unobserve(target);
      }
    });
  }, DEFAULT_OBSERVER_OPTIONS);
  img.onerror = () => {
    img.src = BASE64_BLANK_IMG;
    img.onerror = null;
  };
  observer.observe(img);
};

export const lazyLoadImgList = (imgList: HTMLImageElement[]) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const { target } = entry;
        const img = target as HTMLImageElement;
        img.src = (img.dataset.src as string) || BASE64_BLANK_IMG;
        observer.unobserve(target);
      }
    });
  }, DEFAULT_OBSERVER_OPTIONS);
  imgList.forEach((img) => {
    img.onerror = () => {
      img.src = BASE64_BLANK_IMG;
      img.onerror = null;
    };
    observer.observe(img);
  });
};
