const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const localModules = path.resolve(__dirname, "node_modules");

// Apply NativeWind FIRST so it doesn't overwrite our resolver
const config = withNativeWind(getDefaultConfig(__dirname), {
  input: "./global.css",
});

// Wrap whatever resolveRequest NativeWind (or Expo) set up
const upstreamResolveRequest =
  config.resolver.resolveRequest ??
  ((ctx, name, platform) => ctx.resolveRequest(ctx, name, platform));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Stub react-native-maps on web
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      filePath: path.resolve(__dirname, "src/lib/react-native-maps.web.ts"),
      type: "sourceFile",
    };
  }

  // Force react & react-dom (+ subpaths) to resolve from local node_modules
  // Prevents monorepo duplicate-React crashes
  if (
    moduleName === "react" ||
    moduleName.startsWith("react/") ||
    moduleName === "react-dom" ||
    moduleName.startsWith("react-dom/")
  ) {
    // Pretend the import originates from inside local node_modules
    // so the resolver finds the local copy first
    const fakeOrigin = path.join(localModules, "__packages__", "_.js");
    return context.resolveRequest(
      { ...context, originModulePath: fakeOrigin },
      moduleName,
      platform,
    );
  }

  return upstreamResolveRequest(context, moduleName, platform);
};

module.exports = config;
