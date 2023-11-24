// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: ["react-native-reanimated/plugin", "nativewind/babel", "react-native-paper/babel"],
//   };
// };

module.exports = function (api) {
  // const pak = require('./package.json');

  api.cache(true);
  return {
    // presets: ['babel-preset-expo'],
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],

        }
      ],
      'react-native-reanimated/plugin', "nativewind/babel", "react-native-paper/babel"
    ]
  };
};