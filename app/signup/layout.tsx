import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản - Vũng Tàu Travel",
  description: "Tạo tài khoản để lưu giữ những khoảnh khắc bên biển và khám phá Vũng Tàu.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}