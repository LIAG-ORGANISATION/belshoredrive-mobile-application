const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const withStorybook = require("@storybook/react-native/metro/withStorybook");

const config = getDefaultConfig(__dirname);

// Chain the withNativeWind and withStorybook configurations
module.exports = withStorybook(
	withNativeWind(config, { input: "./src/global.css" }),
	{
		enabled: true,
		configPath: path.resolve(__dirname, "./.storybook"),
	},
);
