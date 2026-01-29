import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Bảo vệ route /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Cho phép truy cập trang login mà không cần check admin
    if (request.nextUrl.pathname === "/admin/login") {
      return response;
    }

    // Nếu chưa đăng nhập -> Về trang login
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Nếu là trang profile -> Cho phép truy cập (vì user thường cũng cần xem profile)
    if (request.nextUrl.pathname === "/admin/profile") {
      return response;
    }

    // Các trang admin khác (dashboard, users, places...) -> Kiểm tra role admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && user.email !== "hoangthienluan17@gmail.com") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};