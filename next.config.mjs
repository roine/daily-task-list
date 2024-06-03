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
        destination: `${process.env.API_URL}/api/:path*`, // Proxy to Backend
      },

    ];
  },
    async redirects() {
        return [
            {
                source: '/auth/logout',
                destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/logout`,
                permanent: false,
                basePath: false
            },
            {
                source: '/profile',
                destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/profile`,
                permanent: false,
                basePath: false
            },
        ]
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
