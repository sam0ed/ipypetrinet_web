const path = require('path');
// We might not need the version from package.json for this standalone bundle directly in its name,
// but it's good practice if we ever decide to version the webapp's static assets.
// const version = require('../package.json').version; // Relative path to root package.json

// Define the base directory for this config, which is webapp/
const baseDir = __dirname; // This will be /path/to/your/project/webapp

module.exports = {
  mode: 'development', // Or 'production' for minified builds
  entry: path.resolve(baseDir, 'app_src', 'index.ts'), // Entry point: webapp/app_src/index.ts
  output: {
    filename: 'bundle.js',
    path: path.resolve(baseDir, 'static', 'js'), // Output: webapp/static/js/bundle.js
    library: 'IpypetrinetWebApp', // Optional: if you want to expose your app as a global
    libraryTarget: 'umd', // Universal Module Definition
    publicPath: '/static/js/' // Or can be '' if /file/ prefix handles all serving
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // Point to the tsconfig file now located in the webapp/ directory
          configFile: path.resolve(baseDir, 'tsconfig.webapp.json'),
          transpileOnly: true // This skips type checking AND linting during build
        }
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre' // Important to apply source map loader before other loaders
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader'    // Processes CSS @import and url()
          // For production, you might replace 'style-loader' with MiniCssExtractPlugin.loader
          // to get a separate CSS file. For now, style-loader is simpler.
        ],
        // Make sure it only processes CSS from our app_src folder
        include: path.resolve(baseDir, 'app_src', 'css')
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // This is the crucial part:
      // When an import statement says `import ... from '@jupyter-widgets/base'`,
      // Webpack will look for `webapp/stubs/jupyter-widgets-base.js` instead.
      '@jupyter-widgets/base': path.resolve(baseDir, 'stubs', 'jupyter-widgets-base.js')
    }
  },
  devtool: 'eval-source-map', // Good for development, offers better debugging
  // externals: {
  //   // If you decide to load some libraries via CDN, you can list them here
  //   // e.g., 'some-library': 'SomeLibraryGlobal'
  // },
  // If you want to use webpack-dev-server
  // devServer: {
  //   static: {
  //     directory: path.resolve(baseDir, 'static'), // Serve files from webapp/static
  //   },
  //   port: 8080, // Or any other port
  //   // You might need to proxy API requests to your Flask server
  //   proxy: {
  //     '/api': 'http://localhost:5000' // Assuming Flask runs on 5000 and API routes start with /api
  //   }
  // }
}; 