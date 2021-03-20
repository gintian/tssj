const path = require('path')

function resolve(name) {
  return path.resolve(__dirname,name)
}
module.exports = {
  // devServer:{
  //   port: 9000,
  //   host: '0.0.0.0'
  // },
  devServer:{
    // host: '0.0.0.0',
    port: 9000,
    // autoOpenBrowser: true,
    // errorOverlay: true,
    // notifyOnErrors: true,
    // poll: false,
    // proxy:{
    //   '/': {     //这里最好有一个 /
    //     target: 'http://192.168.1.36:8093/',  // 后台接口域名
    //     // ws: true,        //如果要代理 websockets，配置这个参数
    //     secure: false,  // 如果是https接口，需要配置这个参数
    //     changeOrigin: true,  //是否跨域
    //     pathRewrite:{
    //       '':''
    //     }
    //   }
    // }
  },
  publicPath: './',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      title: 'tshj',
    }

  },
  configureWebpack: () => ({
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }),
  // chainWebpack: config => {
  //     const jsRule = config.module.rule('js');
  //     jsRule.uses.clear();
  //
  //     jsRule
  //       .test(/\.js$/)
  //       .include
  //       .add( resolve('node_modules/element-ui') )
  //       .add( resolve('src') )
  //       .end()
  //       .use('babel-loader')
  //       .loader('babel-loader')
  //       .end();
  // },
}
