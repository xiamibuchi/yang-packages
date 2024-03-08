# cypress

cypress 在 ci 中运行环境设置会遇到各种问题，官方提供了 docker 镜像：cypress/base。

注意：由于访问网页时可能遇到网页的 load 事件没有触发，可能是由于：

先后访问了两个网址相同的网站
CDN 由于做了 refer 的限制，可以通过 cy.intercept 修改 header 的 referer 来解决

## intercept

```js
// mock 接口
describe('test', () => {
  // mock 接口
  beforeEach(() => {
    cy.intercept('POST', '/api/xxx*', {
      fixture: 'xxx.json', // 位于相对 fixtures/xxx.json
    });
    // 修改 request referer
    cy.intercept(
      {
        hostname: 'xxx',
      },
      (req) => {
        req.headers.referer = 'xxx';
        req.continue();
      }
    );
  });
});
```

## ci

gitlab 中能够识别的 xml 格式，就可以在 pipelines 中看到测试报告
