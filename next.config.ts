import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "aarnwvnxykocrgnbstez.supabase.co", 
      "images.unsplash.com",            
    ],
  },
};

export default nextConfig;
