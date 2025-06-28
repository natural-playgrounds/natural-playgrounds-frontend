module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "natural-playgrounds-production.s3.amazonaws.com",
      "images.unsplash.com",
    ],
    unoptimized: true, // Disable image optimization to fix WASM issue
  },
};
