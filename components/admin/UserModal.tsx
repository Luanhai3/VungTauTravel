"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Loader2, Mail, Eye, RefreshCw, Copy, Check } from "lucide-react";
import { User, Role, addUser } from "@/lib/users";
import Image from "next/image";

interface UserModalProps {
  onClose: () => void;
  onSave: () => void;
}

export default function UserModal({ onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "editor" as Role,
    avatarUrl: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Giới hạn kích thước file 1MB
      if (file.size > 1024 * 1024) {
        alert("Vui lòng chọn ảnh có kích thước dưới 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleCopyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const getStrengthColor = (s: number) => {
    if (s <= 2) return "bg-red-500";
    if (s === 3) return "bg-yellow-500";
    if (s === 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      alert("Tên đăng nhập phải là một địa chỉ email hợp lệ.");
      return;
    }

    setIsSubmitting(true);

    // Giả lập độ trễ xử lý
    await new Promise(resolve => setTimeout(resolve, 500));

    addUser(formData);

    if (sendNotification) {
      // Giả lập gửi email
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Đã gửi email thông báo chào mừng đến ${formData.username}`);
    }

    setIsSubmitting(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Thêm người dùng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <Image 
                    src={previewUrl} 
                    alt="Xem trước ảnh đại diện người dùng mới"
                    title="Ảnh đại diện"
                    fill 
                    className="object-cover" 
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-center text-xs text-gray-500 mt-2">
                Ảnh đại diện
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              name="username"
              type="email"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                name="password"
                type="text"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none pr-20"
                placeholder="Nhập hoặc tạo mật khẩu"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Sao chép mật khẩu"
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Tạo mật khẩu ngẫu nhiên"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level}
                      className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                        strength >= level ? getStrengthColor(strength) : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-right text-gray-500">
                  Độ mạnh: <span className={`font-medium ${
                    strength <= 2 ? "text-red-500" : 
                    strength === 3 ? "text-yellow-600" : 
                    strength === 4 ? "text-blue-600" : "text-green-600"
                  }`}>
                    {strength <= 2 ? "Yếu" : strength === 3 ? "Trung bình" : strength === 4 ? "Mạnh" : "Rất mạnh"}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Họ tên
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendNotification"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="sendNotification" className="text-sm text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Gửi email thông báo
              </label>
            </div>
            {sendNotification && (
              <button
                type="button"
                onClick={() => setShowEmailPreview(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" /> Xem trước
              </button>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Đang xử lý..." : "Thêm người dùng"}
            </button>
          </div>
        </form>
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Xem trước Email
              </h3>
              <button onClick={() => setShowEmailPreview(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Tiêu đề</span>
                <p className="text-gray-900 font-medium">Chào mừng {formData.name || "..."} đến với hệ thống</p>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Nội dung</span>
                <div className="bg-gray-50 p-3 rounded-lg text-gray-600 space-y-2 border border-gray-100">
                  <p>Xin chào <strong>{formData.name || "..."}</strong>,</p>
                  <p>Tài khoản quản trị của bạn đã được khởi tạo thành công.</p>
                  <div className="pl-3 border-l-2 border-primary-200 my-2 text-xs">
                    <p>Username: <span className="font-mono text-gray-900">{formData.username || "..."}</span></p>
                    <p>Password: <span className="font-mono text-gray-900">{formData.password || "..."}</span></p>
                    <p>Role: <span className="font-mono text-gray-900">{formData.role}</span></p>
                  </div>
                  <p>Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản.</p>
                  <p className="text-xs text-gray-400 mt-2">Trân trọng,<br/>Admin Team</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right border-t border-gray-100">
              <button 
                onClick={() => setShowEmailPreview(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}