/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Configuración para desarrollo
  async rewrites() {
    return [
      {
        source: '/api/ejercicios/:path*',
        destination: 'http://localhost:8001/api/:path*', // Proxy a generador-ejercicios API
      },
    ];
  },
};

module.exports = nextConfig;
