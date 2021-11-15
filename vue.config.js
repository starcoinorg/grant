'use strict'
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const svgFilePath = resolve('/src/assets/svg')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  lintOnSave: isDev,
  productionSourceMap: false,
  devServer: {
    port: process.env.VUE_APP_PORT,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
  },
  configureWebpack: {
    name: process.env.VUE_APP_TITLE,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.module
        .rule('vue-svgicon')
        .include.add(svgFilePath)
        .end()
        .test(/\.svg$/)
        .use('svgicon')
        .loader('@yzfe/svgicon-loader')
        .options({
            svgFilePath
        })

    config.module.rule('svg').exclude.add(svgFilePath).end()

    // svgicon transformAssetUrls
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((opt) => {
          opt.transformAssetUrls = opt.transformAssetUrls || {}
          opt.transformAssetUrls['icon'] = ['data']
          return opt
      })

      config.when(!isDev, (config) => {
        /**
         * use terser optimization
         */
        config.optimization
          .minimizer('Terser')
          .use(require('terser-webpack-plugin'), [
            {
              test: /\.js(\?.*)?$/i
            }
          ])
          .end()
        /**
         * split chunks
         */
        config.optimization.splitChunks({
          chunks: 'all',
          minChunks: 1,
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              reuseExistingChunk: true
            },
            common: {
              name: 'components',
              test: resolve('src/components'),
              priority: 20,
              reuseExistingChunk: true
            }
          }
        })
        config.optimization.runtimeChunk('single')
      })
      config.resolve.alias.set('@', resolve('src')).end()
      // svgicon alias
      config.resolve.alias.set('@icon', svgFilePath)
  }
}
