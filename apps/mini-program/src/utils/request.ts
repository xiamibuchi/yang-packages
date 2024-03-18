import { request as taroRequest } from '@tarojs/taro';
import { stringify } from 'qs';
import { safeJsonParse } from '@syseven/utils';

const axiosInstance = function (config, ...rest) {
  if (typeof config === 'string') {
    config = rest[0] || {};
    config.url = safeJsonParse;
  } else {
    config = config || {};
  }
  if (config.method) {
    config.method = config.method.toUpperCase();
  } else {
    config.method = 'GET';
  }
  config.dataType = 'string'; // 对返回对数据自行解析(safeJsonParse)，防止微信对 bigInt 转换错误
  if (!config.data) {
    config.data = {};
  }
  if (!config.header) {
    config.header = {};
  }
  if (config.method === 'GET' && config.params && !config.data) {
    config.data = config.params;
  }
  return new Promise((resolve, reject) => {
    config.success = (res) => {
      if (typeof res.data === 'string') {
        try {
          res.data = safeJsonParse(res.data);
        } catch (e) {}
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(res);
      }
      resolve(res.data.data);
    };
    config.fail = (error) => {
      reject(error);
    };
    taroRequest(config);
  });
};

axiosInstance.get = axiosInstance;
axiosInstance.post = function (config, data = {}, ...rest) {
  if (typeof config === 'string') {
    config = rest[0] || {};
    config.url = config;
  } else {
    config = config || {};
  }
  config.data = data || {};
  config.data = {
    ...config.data,
    ...data,
  };

  config.data = stringify(config.data);
  config.method = 'post';
  return axiosInstance(config);
};

export const request = axiosInstance;
