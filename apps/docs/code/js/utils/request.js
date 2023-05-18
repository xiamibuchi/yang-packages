/* eslint-disable prefer-rest-params */
export const supportedMethod = [
  'OPTIONS',
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'TRACE',
  'CONNECT',
];

export class Request {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
  }
  request(config = {}) {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    }

    config = {
      ...this.defaults,
      ...config,
    };
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    return new Promise((resolve, reject) => {
      config.success = resolve;
      config.fail = reject;
      // eslint-disable-next-line no-undef
      wx.request(config);
    });
  }
}
