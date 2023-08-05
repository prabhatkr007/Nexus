const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  let targetURL = 'https://blog-backend-ne6c.onrender.com';


  app.use(
    '/api',
    createProxyMiddleware({
      target: targetURL,
      changeOrigin: true,
    })
  );
};
