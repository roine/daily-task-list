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
    // ... other options you like
};

export default withPWA(nextConfig);