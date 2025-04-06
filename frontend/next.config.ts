import type { NextConfig } from "next";
import { Configuration } from "webpack";

const nextConfig: NextConfig = {
  /* 他の設定オプション */
  webpackDevMiddleware: (config: Configuration) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;