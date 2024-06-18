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


/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://stackoverflow.com/questions/71847778/why-my-nextjs-component-is-rendering-twice
  reactStrictMode: false,
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

export default withPWA(nextConfig);
