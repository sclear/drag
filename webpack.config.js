const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  devtool: "source-map", 
  mode: 'development',
  entry: './src/main.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
         appendTsSuffixTo: [/\.vue$/],
        }
      }
      // {
      //   test: /\.ts$/,
      //   use
      // }
    ]
  },
  resolve: {
    extensions: ['.js', '.css', '.ts']
  },
  plugins: [
    new HtmlWebpackPlugin({ // 打包输出HTML
      title: 'Hello World app',
      template: './dist/index.html',
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      },
      filename: 'index.html',
      //   template: 'index.html'
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "./dist"),
    compress: true,
    port: 9000,
    hot: true,
    inline: true,
  }
}
