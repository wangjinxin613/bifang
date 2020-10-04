// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// vue.config.js
const vueConfig = {

  runtimeCompiler: true,
  
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, './src/assets/style/base.less')]
    }
  },

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        lessOptions: {
          javascriptEnabled: true,
        },
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8080,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      [process.env.VUE_APP_API_BASE_URL + '/']: {
        target: 'http://192.168.3.4:18071/',
        // target: 'http://nongdev.chaincomp.net/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_TEST_API1}`]: 'api'
        }
      },
      [process.env.VUE_APP_BASE_TEST_API1 + '/']: {
        target: 'http://192.168.3.139:18081/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_TEST_API1}`]: 'api'
        }
      },
    },
    disableHostCheck: true
  },

  // disable source map in production
  productionSourceMap: false,

  lintOnSave: false,

  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

module.exports = vueConfig
