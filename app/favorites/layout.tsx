import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Địa điểm yêu thích - Vũng Tàu Travel",
  description: "Danh sách các địa điểm du lịch Vũng Tàu bạn đã lưu.",
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}