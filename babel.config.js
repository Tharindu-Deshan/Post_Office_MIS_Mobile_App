module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',  // This should match the import module name.
        path: '.env',  // This is the path to your .env file.
        safe: false,  // Set to true if you are using .env.example for defaults.
        allowUndefined: true,  // Allow undefined variables (set to false if you want to enforce variable definitions).
        verbose: false  // Set to true for more logging information.
      }]
    ],
  };
};
