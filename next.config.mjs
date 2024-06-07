import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  dest: "public",
  workboxOptions: {
    disableDevLogs: true,
  },
  // ... other options you like
});

const devSettings = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/app/api/:path*`, // Proxy to Backend
      },
      {
        source: "/auth/:path*",
        destination: `${process.env.BACKEND_URL}/app/auth/:path*`,
      },
      {
        source: "/profile",
        destination: `${process.env.BACKEND_URL}/app/profile`,
      },
      {
        source: "/app/:path*",
        destination: `${process.env.BACKEND_URL}/app/:path*`,
      },
    ];
  },
};

const prodSettings = {
  output: "export",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === "production" ? prodSettings : {}),
  ...(process.env.NODE_ENV !== "production" ? devSettings : {}),
};

export default withPWA(nextConfig);
