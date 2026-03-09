const path = require('path');
const WrmPlugin = require('atlassian-webresource-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/App.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../backend/src/main/resources/frontend'),
    filename: 'js/bundled.[name].js',
    clean: true,
    publicPath: '/jira/download/resources/com.atlassian.aservo.myPlugin:entrypoint-app/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },
    ],
  },
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      runtime: false,
    }),
    new WrmPlugin({
      pluginKey: 'com.atlassian.aservo.myPlugin',
      locationPrefix: 'frontend',
      contextMap: {
        app: ['app'],
      },
      watch: true,
      xmlDescriptors: path.resolve(
        __dirname,
        '../backend/src/main/resources',
        'META-INF',
        'plugin-descriptors',
        'wr-defs.xml'
      ),
    }),
  ],
};