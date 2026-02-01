// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(
          name: string,
          value: string,
          options: {
            path?: string;
            domain?: string;
            expires?: Date;
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: "strict" | "lax" | "none";
            maxAge?: number;
          } = {}
        ) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(
          name: string,
          options: {
            path?: string;
            domain?: string;
            expires?: Date;
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: "strict" | "lax" | "none";
            maxAge?: number;
          } = {}
        ) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  return { supabase, response };
}
