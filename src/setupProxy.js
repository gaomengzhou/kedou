/**
 * @description 反向代理配置项
 * @time 2020/1/8
 * @author Aiden
 */
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
	app.use(
		proxy(
			'/kedou/api', {
				// target: 'https://kdsp9.xyz',  
				target: 'http://tadpole-appapi.fftechs.com:2082/',
				// target: 'https://api.sgdd02.com:443/',  
				changeOrigin: true,
				pathRewrite: {
					'^/kedou/api': ''
				}
			}
		)
	)
}