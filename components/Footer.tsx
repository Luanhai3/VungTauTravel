"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import Particles from "@/components/Particles";
import { getSupabaseBrowser } from "@/utils/supabase/client";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = getSupabaseBrowser();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Vui lòng nhập địa chỉ email.");
      return;
    }

    const { error } = await supabase.from("subscribers").insert({ email });

    if (error) {
      if (error.code === '23505') { // Lỗi unique_violation (email đã tồn tại)
        setMessage("Email này đã được đăng ký trước đó. Cảm ơn bạn!");
      } else {
        setMessage("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } else {
      setMessage("Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-teal-950 text-white pt-24 pb-12 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-teal-950"></div>
        <Particles />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold tracking-tight uppercase block text-white">
              Vũng Tàu
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Khám phá vẻ đẹp tiềm ẩn của thành phố biển. Nơi lưu giữ những khoảnh khắc đáng nhớ và trải nghiệm tuyệt vời nhất của bạn.
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-slate-500">Khám phá</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#categories" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  <span className="group-hover:translate-x-1 transition-transform">Danh mục</span>
                </Link>
              </li>
              <li>
                <Link href="/#places" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  <span className="group-hover:translate-x-1 transition-transform">Địa điểm nổi bật</span>
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  <span className="group-hover:translate-x-1 transition-transform">Về Vũng Tàu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-slate-500">Liên hệ</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                <span>Vũng Tàu, Thành Phố Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span>xxxxxxxxxxxxxxx</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span>hoangthienluan17@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold mb-6 uppercase tracking-widest text-slate-500">Đăng ký nhận tin</h3>
            <p className="text-slate-400 text-sm mb-4">
              Nhận thông tin mới nhất về các địa điểm du lịch và ưu đãi hấp dẫn.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-teal-900 border border-teal-800 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white placeholder-teal-700 transition-all"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg transition-all"
              >
                Đăng ký ngay
              </button>
            </form>
            {message && (
              <p className="text-xs mt-3 text-green-400">{message}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-teal-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-teal-700 text-sm">
          <p>&copy; {new Date().getFullYear()} Vũng Tàu Travel | All rights reserved | Design by Louis Hoang</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}