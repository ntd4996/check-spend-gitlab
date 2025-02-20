import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt source maps trong development để giảm kích thước header
  productionBrowserSourceMaps: false,
  
  // Cấu hình server để tăng giới hạn header
  experimental: {
    // Tăng giới hạn kích thước dữ liệu
    largePageDataBytes: 128 * 1000,
  },

  // Tối ưu webpack
  webpack: (config, { dev }) => {
    // Tắt source maps trong development
    if (dev) {
      config.devtool = false;
    }

    // Tối ưu bundle size
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      },
    };

    return config;
  },

  // Tắt một số tính năng không cần thiết
  poweredByHeader: false,
  reactStrictMode: false,
};

export default nextConfig;
