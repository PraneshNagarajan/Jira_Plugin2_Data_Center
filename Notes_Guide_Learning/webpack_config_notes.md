```javascript
const path = require('path');
const WrmPlugin = require('atlassian-webresource-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/App.tsx',
  },

  output: {
    path: path.resolve(__dirname, '../backend/src/main/resources/frontend'),
    filename: 'js/bundled.[name].js',
    clean: true,
    /** publicPath = by default, this build dir for 'images/png/jpeg/jpg/icon ' (path: path.resolve(__dirname, '../backend/src/main/resources/frontend')) while 'npm build'
     *  but below directory is build directory if run build for jira plugin using 'atlas-run', 'atlas' 
     * publicPath is help to tell location where it's present. 
     *  Atlassian default path = /jira/download/resources
     * 
     * **/
    publicPath: '/jira/download/resources/{groupId}.{artifactId}:{web-resource-key}/',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  module: {
    rules: [

       new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
      /**
       * JAVASCRIPT / TYPESCRIPT / JSX / TSX
       *
       * Why do JS/TS need a loader when CSS/images don't (in webpack 5)?
       * webpack natively understands JS/JSON — but it only understands ES5.
       * It cannot parse modern syntax (arrow functions, JSX, TypeScript types).
       * So we need a loader to TRANSFORM the code before webpack processes it.
       *
       * Two options:
       *
       * Option A — ts-loader (current, used here)
       *   - Uses the TypeScript compiler (tsc) under the hood
       *   - Handles both TypeScript AND JSX/TSX in one step
       *   - Full type checking: build FAILS on type errors
       *   - Slower because it type-checks every file
       *   - Config: tsconfig.json
       *   - Install: npm install ts-loader typescript --save-dev
       *
       * Option B — babel-loader
       *   - Uses Babel to STRIP types and transform JSX — does NOT type check
       *   - Faster because it just transforms syntax, never validates types
       *   - Build SUCCEEDS even with type errors (type check separately with tsc --noEmit)
       *   - Needs extra packages: @babel/preset-typescript + @babel/preset-react
       *   - Config: babel.config.js
       *   - Install: npm install babel-loader @babel/core @babel/preset-env
       *              @babel/preset-typescript @babel/preset-react --save-dev
       *
       * Why babel-loader if it handles JSX/JS too?
       *   babel-loader CAN handle .tsx/.ts but it's just a stripper, not a type checker.
       *   ts-loader is stricter and safer for a Jira plugin where correctness matters.
       *   Use babel-loader if build speed becomes a problem in larger projects.
       *
       * webpack 4 note: same loaders were needed, nothing changed here in webpack 5.
       */
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
        // To switch to babel-loader:
        // use: 'babel-loader',
        // and add babel.config.js with presets:
        //   ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
      },

      /**
       * CSS
       *
       * webpack 5 has NO built-in CSS support — loaders are still required.
       * (Unlike images/SVGs which became built-in asset types in webpack 5)
       *
       * Two loaders needed, applied right-to-left:
       *   1. css-loader        — parses the CSS file, resolves @import and url()
       *   2. MiniCssExtract    — extracts parsed CSS into a separate .css output file
       *
       * Why not style-loader?
       *   style-loader injects CSS as <style> tags at runtime via JS.
       *   MiniCssExtractPlugin outputs a real .css file that WRM can serve directly.
       *   Jira plugins need the .css file — style-loader won't work here.
       *
       * webpack 4 note: same setup, no change in webpack 5 for CSS.
       */
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },

      /**
       * SVG
       *
       * webpack 5: built-in asset/resource — NO loader package needed.
       *   Copies the file to output dir and replaces the import with the output URL.
       *
       * webpack 4: required file-loader (external package):
       *   { test: /\.svg$/, use: [{ loader: 'file-loader', options: { name: 'images/[name].[ext]' } }] }
       *   npm install file-loader --save-dev
       *
       * Other webpack 5 asset types:
       *   asset/inline  — inlines file as base64 data URL (replaces url-loader)
       *   asset         — auto picks resource vs inline based on file size (8kb default)
       */
      {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },

      /**
       * Images (png, jpg, jpeg, gif)
       *
       * webpack 5: same as SVG — built-in asset/resource, no extra package.
       *
       * webpack 4: required file-loader or url-loader:
       *   url-loader would inline small images as base64, fall back to file-loader for large ones.
       *   npm install url-loader file-loader --save-dev
       *
       * Optional: add image-webpack-loader on top for compression (works in both v4 and v5):
       *   use: [{ loader: 'image-webpack-loader', options: { mozjpeg: { quality: 80 } } }]
       *   npm install image-webpack-loader --save-dev
       *   Not needed here — Jira plugin images are usually small.
       */
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' },
      },
    ],
  },

  /**
   * Watch mode — rebuilds on every file save.
   * Used during development alongside atlas-run.
   * atlas-run detects the new files in resources/ and hot-reloads the plugin.
   * Set to false for one-off production builds.
   */
  watch: true,

  plugins: [
    /**
     * MiniCssExtractPlugin
     * Works with css-loader above to produce a separate css/[name].css file.
     * WRM picks this up and serves it as a web resource to Jira pages.
     * runtime: false — no extra runtime JS chunk for CSS loading (not needed here).
     *
     * webpack 4 note: same plugin, same config — no change in webpack 5.
     */
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      runtime: false,
    }),

    /**
     * WrmPlugin (Atlassian Web Resource Manager)
     *
     * Generates wr-defs.xml which registers JS/CSS bundles as Jira web resources.
     * Jira reads wr-defs.xml at startup and knows how to serve these files.
     *
     * pluginKey    : must match <atlassian-plugin key="..."> in atlassian-plugin.xml
     * locationPrefix: subfolder under src/main/resources where output files live
     * contextMap   : links webpack entry name ('app') to a Jira resource context ('app')
     *                must match $webResourceManager.requireResourcesForContext("app")
     *                in your Velocity (.vm) template
     * xmlDescriptors: where to write wr-defs.xml — Maven reads this during packaging
     */
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
   devServer: {
    port: 3000,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    open: true,
  },
};
```
