const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Chain the withNativeWind and withStorybook configurations
module.exports = withNativeWind(config, { input: "./src/global.css" });
