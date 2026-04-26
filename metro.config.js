const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    blockList: [
      /.*[\\/]\.gradle[\\/].*/,
      /.*[\\/]android[\\/]build[\\/].*/,
      /.*[\\/]android[\\/]app[\\/]build[\\/].*/,
      /.*[\\/]ios[\\/]build[\\/].*/,
      /.*[\\/]node_modules[\\/].+[\\/]android[\\/]build[\\/].*/,
      /.*[\\/]node_modules[\\/].+[\\/]ios[\\/]build[\\/].*/,
      /.*[\\/]generated[\\/]ksp[\\/].*/,
    ],
  },
  watchFolders: [__dirname],
};

module.exports = mergeConfig(defaultConfig, config);