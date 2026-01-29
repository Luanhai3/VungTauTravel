import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vungtautravel.com"; // Thay bằng domain thật của bạn

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Chặn bot index trang admin và các API riêng tư
      disallow: ["/admin/", "/api/auth/"],
    },
    // Chỉ định đường dẫn sitemap để Google tìm thấy dễ dàng hơn
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}