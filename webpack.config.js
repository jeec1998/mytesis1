const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.web.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    environment: {
      module: false, 
    },
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native/Libraries/Utilities/codegenNativeComponent':
        require.resolve('./shims/codegenNativeComponent.web.js'),
    },
    extensions: ['.web.tsx', '.tsx', '.ts', '.web.js', '.js', '.json'],
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        resolve: {
          fullySpecified: false,
        },
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'web/home.html'),
          to: 'home.html',
        },
        {
          from: path.resolve(__dirname, 'web/perfil.html'),
          to: 'perfil.html', 
        },
        {
          from: path.resolve(__dirname, 'web/ver-estudiantes.html'),
          to: 'ver-estudiantes.html', 
        },
        {
          from: path.resolve(__dirname, 'web/agregar-recursos.html'),
          to: 'agregar-recursos.html', 
        },
        {
          from: path.resolve(__dirname, 'web/admin.html'),
          to: 'admin.html', 
        },
        {
          from: path.resolve(__dirname, 'web/home-alumno.html'),
          to: 'home-alumno.html', 
        },
        {
          from: path.resolve(__dirname, 'web/materias-docentes.html'),
          to: 'materias-docentes.html', 
        },
        {
          from: path.resolve(__dirname, 'web/agregar-temas.html'),
          to: 'agregar-temas.html', 
        },
        {
          from: path.resolve(__dirname, 'web/refuerzo-estudiantes.html'),
          to: 'refuerzo-estudiantes.html', 
        },
        {
          from: path.resolve(__dirname, 'web/actividades.html'),
          to: 'actividades.html',
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
    host: 'localhost',
  },
};
