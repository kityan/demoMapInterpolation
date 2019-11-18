const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production'
const buildStats = process.argv.indexOf('-stats') >= 0

const srcPath = path.resolve(__dirname, 'src')
const distPath = path.resolve(__dirname, 'dist')

module.exports = {
  devtool: isProduction ? undefined : 'source-map',
  devServer: {
    disableHostCheck: true,
    host: '127.0.0.1',
    port: 8080,
    public: 'localhost:8080',
    open: true,
    historyApiFallback: true,
    publicPath: '/',
  },
  context: srcPath,
  entry: './main.jsx',
  output: {
    path: distPath,
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.s?css$/,
      oneOf: [{
        resourceQuery: /global/, // foo.css?global
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
          ]
        })
      },
      {
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: !isProduction,
              importLoaders: 2,
              localIdentName: isProduction ? '[local]_[hash:base64:5]' : '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader'
          }
          ]
        })
      }
      ]
    },
    {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }]
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [{
        loader: 'url-loader?limit=15000',
      }]
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './assets/index.' + (isProduction ? 'production' : 'development') + '.html'
    }),
    new webpack.NormalModuleReplacementPlugin(/(.*)_BUILD_TARGET_(\.*)/, function (resource) {
      resource.request = resource.request.replace(/_BUILD_TARGET_/, isProduction ? 'production' : 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.includes('node_modules')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['runtime']
    }),
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    }),
  ]
}

if (isProduction) {
  let arr = [
    new CleanWebpackPlugin(),
    ...module.exports.plugins,
    new UglifyJsPlugin({
      sourceMap: false
    }),
  ]
  if (buildStats) {
    arr = [...arr,
    new Visualizer({
      filename: './stats.html'
    }),
    ]
  }
  arr = [
    ...arr,
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 4096,
      minRatio: 0.8
    })
  ]
  module.exports.plugins = arr
}
