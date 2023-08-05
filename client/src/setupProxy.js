const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  let targetURL = 'http://localhost:4000';


  app.use(
    '/api',
    createProxyMiddleware({
      target: targetURL,
      changeOrigin: true,
    })
  );
};
