import { MetadataRoute } from "next";
import { getSupabaseServer } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabaseServer();
  const baseUrl = "https://vung-tau-travel.vercel.app";

  // 1. Các trang tĩnh
  const staticRoutes = [
    "",
    "/about",
    "/categories/an-uong",
    "/categories/hen-ho",
    "/categories/check-in",
    "/categories/du-lich",
    "/categories/tham-quan",
    "/categories/di-tich",
    "/categories/thien-nhien",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Các trang động (Chi tiết địa điểm)
  const { data: places } = await supabase
    .from("places")
    .select("id, created_at");

  const dynamicRoutes = places
    ? places.map((place) => ({
        url: `${baseUrl}/places/${place.id}`,
        lastModified: new Date(place.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...dynamicRoutes];
}
