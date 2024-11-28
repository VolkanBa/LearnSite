module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.js$/,
        include: /node_modules\/pdfjs-dist/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ["@babel/plugin-transform-private-methods", { loose: true }],
              ["@babel/plugin-transform-private-property-in-object", { loose: true }]
            ],
          },
        },
      });
      return webpackConfig;
    },
  },
};
