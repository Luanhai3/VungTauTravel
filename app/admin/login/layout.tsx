import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập - Vũng Tàu Travel",
  description: "Đăng nhập để quản lý địa điểm yêu thích và trải nghiệm Vũng Tàu trọn vẹn.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}