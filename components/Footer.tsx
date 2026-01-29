"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import Particles from "@/components/Particles";
import { createClient } from "@/utils/supabase/client";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

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
    <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900 animate-gradient-xy"></div>
        <Particles />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="text-4xl font-black tracking-tighter uppercase block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-300 hover:to-white transition-all duration-500">
              Vũng Tàu
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Khám phá vẻ đẹp tiềm ẩn của thành phố biển. Nơi lưu giữ những khoảnh khắc đáng nhớ và trải nghiệm tuyệt vời nhất của bạn.
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Khám phá</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/#categories" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  <span className="group-hover:translate-x-1 transition-transform">Danh mục</span>
                </Link>
              </li>
              <li>
                <Link href="/#places" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  <span className="group-hover:translate-x-1 transition-transform">Địa điểm nổi bật</span>
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                  <span className="group-hover:translate-x-1 transition-transform">Về Vũng Tàu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Liên hệ</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                <span>Vũng Tàu, Thành Phố Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>xxxxxxxxxxxxxxx</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>hoangthienluan17@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">Đăng ký nhận tin</h3>
            <p className="text-gray-400 text-sm mb-4">
              Nhận thông tin mới nhất về các địa điểm du lịch và ưu đãi hấp dẫn.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-white placeholder-gray-500 transition-all backdrop-blur-sm"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transform hover:-translate-y-0.5"
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
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Vũng Tàu Travel | All rights reserved | Design by Louis Hoang</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-primary-400 transition-colors">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-primary-400 transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}