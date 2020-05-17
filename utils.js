const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getStyleLoaders(cssOptions) {
  const isProd = process.env.NODE_ENV === 'production';
  // This is evaluated bottom to top.
  const loaders = [
    {
      loader: 'style-loader',
      options: cssOptions
    },
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !isProd,
      },
    }
  ];

  return loaders;
}

function getBabelLoader() {
  return {
    loader: require.resolve('babel-loader'),
    options: Object.assign({
      babelrc: false,
      configFile: false,
      compact: true,
      presets: [
        [
          '@babel/env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      plugins: [
        // Polyfills the runtime needed for async/await, generators, and friends
        // https://babeljs.io/docs/en/babel-plugin-transform-runtime
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            regenerator: true,
          }
        ]
      ]
    })
  }
}

module.exports = {
  getStyleLoaders,
  getBabelLoader
}
