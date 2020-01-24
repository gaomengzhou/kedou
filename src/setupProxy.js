const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy(
            '/kedou/api',
            {
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