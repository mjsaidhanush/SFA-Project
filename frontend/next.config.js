/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/weather',
                destination: '/dashboard/rain',
                permanent: false,
            },
            {
                source: '/weather-forecast',
                destination: '/dashboard/rain',
                permanent: false,
            },
            {
                source: '/rain',
                destination: '/dashboard/rain',
                permanent: false,
            },
            {
                source: '/dashboard/weather',
                destination: '/dashboard/rain',
                permanent: false,
            },
            {
                source: '/dashboard/weather-forecast',
                destination: '/dashboard/rain',
                permanent: false,
            },
            {
                source: '/crop',
                destination: '/dashboard/crop',
                permanent: false,
            },
            {
                source: '/crop-prediction',
                destination: '/dashboard/crop',
                permanent: false,
            },
            {
                source: '/dashboard/crop-prediction',
                destination: '/dashboard/crop',
                permanent: false,
            },
            {
                source: '/disease',
                destination: '/dashboard/disease',
                permanent: false,
            },
            {
                source: '/disease-detection',
                destination: '/dashboard/disease',
                permanent: false,
            },
            {
                source: '/dashboard/disease-detection',
                destination: '/dashboard/disease',
                permanent: false,
            },
            {
                source: '/market',
                destination: '/dashboard/market',
                permanent: false,
            },
            {
                source: '/schemes',
                destination: '/dashboard/schemes',
                permanent: false,
            },
            {
                source: '/chatbot',
                destination: '/dashboard/chatbot',
                permanent: false,
            },
            {
                source: '/admin',
                destination: '/dashboard/admin',
                permanent: false,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/public/audio/:path*',
                destination: '/audio/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
