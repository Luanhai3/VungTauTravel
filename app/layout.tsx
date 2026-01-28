import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Toast from "@/components/Toast";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Vũng Tàu Travel",
  description: "Khám phá vẻ đẹp tiềm ẩn của thành phố biển Vũng Tàu.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole = 'guest';
  if (user) {
    // Hardcoded admin check for specific email
    if (user.email === 'hoangthienluan17@gmail.com' || user.email === 'hoangthienluan17@gmal.com') {
      userRole = 'admin';
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      userRole = profile?.role ?? 'user';
    }
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar initialUser={user} initialRole={userRole} />
        <Suspense fallback={null}>
          <Toast />
        </Suspense>
        {children}
      </body>
    </html>
  );
}