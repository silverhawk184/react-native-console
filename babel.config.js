module.exports = {
  "presets": ["module:metro-react-native-babel-preset"],
  "plugins": [
    [
      "module-resolver", {
        "root": ["."],
        "alias": {
          "@tma-src": "./src",
          "@tma-vendor": "./vendor",
          "@tma-assets": "./assets"
        }
      }
    ]
  ]
}
