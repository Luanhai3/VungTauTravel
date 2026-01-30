import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Cấu hình cookie options (Chunking được @supabase/ssr tự động xử lý)
      cookieOptions: {
        name: 'sb', // Tên prefix cho cookie
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
        domain: '',
        path: '/',
        sameSite: 'lax',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Cập nhật cookie vào request để Server Components phía sau nhận được session mới (đã gộp hoặc chia nhỏ)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // 2. Tạo lại response để đồng bộ với request mới
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          // 3. Set cookie vào response để gửi về trình duyệt
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in user away from login page
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/profile'
    return NextResponse.redirect(url)
  }

  return response
}
