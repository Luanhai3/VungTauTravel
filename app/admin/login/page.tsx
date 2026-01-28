"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { authenticate, addUser, getUserByUsername } from "@/lib/users";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'mfa'>('login');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (view === 'forgot') {
      if (!email) {
        setError("Vui lòng nhập địa chỉ email");
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/profile`,
      });
      if (error) {
        setError("Lỗi gửi email: " + error.message);
      } else {
        setMessage("Email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
      }
      return;
    }

    if (view === 'login') {
      // Sử dụng Supabase Auth thay vì authenticate local để hỗ trợ 2FA
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // Giả sử username là email
        password,
      });

      if (error) {
        setError("Đăng nhập thất bại: " + error.message);
        return;
      }

      // Kiểm tra xem user có bật 2FA không
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp[0];

      if (totpFactor && totpFactor.status === 'verified') {
        // Nếu có 2FA, chuyển sang màn hình nhập mã
        setView('mfa');
      } else {
        // Nếu không có 2FA, đăng nhập thành công
        if (data.user?.email === "hoangthienluan17@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } else if (view === 'mfa') {
      // Xử lý xác thực mã 2FA
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp[0];

      if (!totpFactor) {
        setError("Không tìm thấy phương thức xác thực.");
        return;
      }

      const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
      if (challenge.error) {
        setError(challenge.error.message);
        return;
      }

      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code: mfaCode,
      });

      if (verify.error) {
        setError("Mã xác thực không đúng.");
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === "hoangthienluan17@gmail.com") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } else if (view === 'signup') {
      // Sign up logic
      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
        }

      addUser({ username, password, name, role: "user", favorites: [] });
      router.push("/");
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Redirect về trang chủ, các trang admin sẽ tự kiểm tra quyền truy cập
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {view === 'login' ? "Đăng nhập" : view === 'signup' ? "Đăng ký tài khoản" : view === 'mfa' ? "Xác thực 2 lớp" : "Quên mật khẩu"}
          </h1>
          <p className="text-gray-600 mt-2">
            {view === 'login' 
              ? "Vui lòng đăng nhập để tiếp tục" 
              : view === 'signup' 
                ? "Tạo tài khoản để lưu địa điểm yêu thích" 
                : view === 'mfa'
                ? "Nhập mã từ ứng dụng xác thực của bạn"
                : "Nhập email để lấy lại mật khẩu"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
              {message}
            </div>
          )}

          {view === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập họ tên của bạn"
                required
              />
            </div>
          )}

          {view === 'forgot' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập địa chỉ email"
                required
              />
            </div>
          ) : view === 'mfa' ? (
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700 mb-2">
                Mã xác thực (6 số)
              </label>
              <input
                id="mfaCode"
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
              />
            </div>
          ) : (
            <>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
            </>
          )}

          {view === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {view === 'login' ? "Đăng nhập" : view === 'signup' ? "Đăng ký" : view === 'mfa' ? "Xác nhận" : "Gửi email khôi phục"}
          </button>
        </form>

        {(view === 'login' || view === 'signup') && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors items-center"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors items-center"
              >
                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          {view === 'login' && (
            <>
              <button
                onClick={() => { setView('forgot'); setError(""); setMessage(""); }}
                className="text-primary-600 hover:text-primary-700 font-medium hover:underline block w-full"
              >
                Quên mật khẩu?
              </button>
              <button
                onClick={() => { setView('signup'); setError(""); setMessage(""); }}
                className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
              >
                Chưa có tài khoản? Đăng ký ngay
              </button>
            </>
          )}
          {(view === 'signup' || view === 'forgot') && (
            <button
              onClick={() => { setView('login'); setError(""); setMessage(""); }}
              className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
            >
              Quay lại đăng nhập
            </button>
          )}
        </div>
      </div>
    </div>
  );
}