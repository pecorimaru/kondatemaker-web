const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
  }),
  (config) => {
    // TypeScriptエラーを無視
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
  },
  (config) => {
    // devServer設定
    if (config.devServer) {
      config.devServer.historyApiFallback = true;
    }
    return config;
  }
); 