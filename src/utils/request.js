/**
 * @description axios 组件封装
 * @time 2020/1/8
 * @author Aiden
 */
import { Toast } from 'antd-mobile';
import axios from 'axios';
import qs from 'qs';
import { crypt, encrypt } from './base';
const { NODE_ENV } = process.env
const { origin } = window.location;
export function initAxios() {
  const instance = axios.create({
    baseURL: NODE_ENV === 'production' ? origin:'/kedou/api' ,
    // baseURL: 'http://tadpole-appapi.fftechs.com:2082',
    timeout: 15000,
    withCredentials: NODE_ENV === 'development' ? true : false,
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
      if (response.data.code === -6) {
        const result = JSON.parse(crypt(response.data.result));
        let res = response.data;
        return { ...res, ...result }
      }
      return response.data
    }
    return JSON.parse(crypt(result));
  }, async (err) => {
    return err
  });

  return instance;
}
