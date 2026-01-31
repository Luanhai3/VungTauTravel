# REQUEST_HEADER_TOO_LARGE (Vercel)

## What it is

- **Vercel limits**: Single header ≤ 16 KB, **all headers combined ≤ 32 KB**.
- The `Cookie` header is one header; its size = sum of all cookie name+value pairs (and formatting).
- If the total size exceeds 32 KB, Vercel returns this error.

## Why it happens here (Supabase + Next.js)

1. **Supabase stores auth in cookies**: access token (JWT), refresh token, sometimes chunked (e.g. `sb-xxx-auth-token.0`, `.1`).
2. **JWTs can be large**: claims, `user_metadata`, MFA, etc. add bytes.
3. **Every request sends all cookies**: so one big `Cookie` header can hit the limit.
4. **Wrong middleware** made it worse: session wasn’t refreshed in middleware, so cookies could get out of sync or accumulate (e.g. stale + new), increasing total size.

## What we changed

- **Single middleware** that:
  - Uses Supabase SSR `createServerClient` with request/response cookie adapter.
  - Calls `supabase.auth.getUser()` so the session is refreshed and cookies are written onto the **response**.
  - Returns that **same response** (with updated cookies) so the next request has correct, minimal cookies.
- **Matcher**: run this middleware on all non-static routes so session is refreshed on every request (recommended by Supabase).

This keeps session cookies in sync and avoids duplicate/stale cookies that would grow the `Cookie` header.

## If the error still appears

- **Already over 32 KB**: User may need to shrink session then re-login:
  - Use **Admin → Profile → “Tối ưu”** to trim `user_metadata`, then log out and log in again (fresh, smaller cookies).
- **OAuth / many scopes**: Reduce OAuth scopes; large ID/refresh tokens from providers can push cookies over the limit.
- **Other cookies**: Check for other large or many cookies (analytics, etc.) and reduce or move to different storage if needed.

## References

- [Vercel: REQUEST_HEADER_TOO_LARGE](https://vercel.com/docs/errors/REQUEST_HEADER_TOO_LARGE)
- [Supabase: Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
