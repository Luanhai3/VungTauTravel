import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { SubmitButton } from "./submit-button";

export default function Signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Tạo tài khoản để lưu giữ những khoảnh khắc đẹp
          </p>
        </div>
        <form className="mt-8 space-y-6" action={signup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div>
            <SubmitButton />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
              ← Quay lại trang chủ
            </Link>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Đã có tài khoản?
            </Link>
          </div>

          {searchParams?.message && (
            <div className="p-4 bg-red-50 text-red-500 text-sm rounded-lg text-center">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
