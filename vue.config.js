module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/interactive-syntax-tree/dist/' : '/',
  lintOnSave: true,
  configureWebpack: {
    mode: process.env.NODE_ENV
  }
};
