import { Toast } from 'antd-mobile';
import axios from 'axios';
import qs from 'qs';
import { crypt, encrypt } from './base';
const {NODE_ENV}=process.env

export function initAxios() {
  const instance = axios.create({
    baseURL: NODE_ENV==='development'?'/kedou/api':'http://tadpole-appapi.fftechs.com:2082',
    timeout: 15000,
    withCredentials: NODE_ENV==='development'?true:false,
    // 设置全局的请求次数，请求的间隙
    retry: 3,
    retryDelay: 1000,
  });


  instance.interceptors.request.use((config) => {
    Toast.loading('加载中...', 0)
    const {
      method,
      url = '',
    } = config;
    if (method === 'get' && url && !url.includes('timestamp')) {
      const timestamp = new Date().getTime();
      if (url.includes('?')) {
        config.url = `${url}&timestamp=${timestamp}`;
      } else {
        config.url = `${url}?timestamp=${timestamp}`;
      }
    }
    if (config.method === 'post') {
      const encryptData = encrypt(config.data);
      config.data = qs.stringify({
        info: encryptData
      });
    }
    return config;
  });


  // Add a response interceptor
  instance.interceptors.response.use(async (response) => {
    Toast.hide()
    const {
      result
    } = response.data;

    // console.log(response.data);
    if (response.data.code !== 0 || !response.data.result.length) {
      return response.data
    }
    return JSON.parse(crypt(result));
  }, async (err) => {
    console.log(err);
  });

  return instance;
}
