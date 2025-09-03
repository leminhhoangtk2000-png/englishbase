const path = require('path');

module.exports = {
  // Disable webpack's built-in caching to prevent snapshot errors
  cache: false,
  
  // Alternative: Use memory cache instead of filesystem cache
  // cache: {
  //   type: 'memory'
  // },
  
  // Resolve configuration
  resolve: {
    // Add fallbacks for Node.js modules in browser environment
    fallback: {
      "fs": false,
      "path": false,
      "os": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "util": false,
      "assert": false,
      "url": false,
      "querystring": false
    },
    
    // Alias configuration for better module resolution
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src')
    },
    
    // File extensions to resolve
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mjs']
  },
  
  // Module configuration
  module: {
    rules: [
      // TypeScript/JavaScript files
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      
      // CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      
      // SCSS/SASS files
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      
      // Image files
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name].[hash][ext]'
        }
      },
      
      // Font files
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name].[hash][ext]'
        }
      }
    ]
  },
  
  // Optimization settings
  optimization: {
    // Split chunks to improve caching
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  
  // Development server configuration
  devServer: {
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*'],
    compress: true,
    historyApiFallback: true
  },
  
  // Stats configuration to reduce console noise
  stats: {
    warnings: false,
    cached: false,
    cachedAssets: false,
    modules: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: false,
    entrypoints: false
  },
  
  // Ignore specific warnings
  ignoreWarnings: [
    /Critical dependency: the request of a dependency is an expression/,
    /Failed to parse source map/,
    /webpack.cache.PackFileCacheStrategy/
  ]
};
