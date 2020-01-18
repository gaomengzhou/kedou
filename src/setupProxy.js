const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy(
            '/kedou/api',
            {
                target: 'http://tadpole-appapi.fftechs.com:2082/',  
                changeOrigin: true, 
                pathRewrite: { 
                    '^/kedou/api': ''
                }
            }
        )
    )  
}