module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
  ],
};
