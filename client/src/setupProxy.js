const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  let targetURL = 'https://blog-backend-ne6c.onrender.com';


  if (process.env.REACT_APP_API_URL) {
    targetURL = process.env.REACT_APP_API_URL;
  }

  app.use(
    '/api',
    createProxyMiddleware({
      target: targetURL,
      changeOrigin: true,
    })
  );
};
