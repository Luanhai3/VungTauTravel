"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Place } from "@/lib/data";
import { Lock, Save, User as UserIcon, Camera, Heart, MapPin, ShieldCheck, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [favoritePlaces, setFavoritePlaces] = useState<Place[]>([]);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEnrolling2FA, setIsEnrolling2FA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [factorId, setFactorId] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push("/admin/login");
        return;
      }

      // Lấy thông tin profile (role, favorites)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata.full_name || authUser.email?.split('@')[0],
        avatarUrl: authUser.user_metadata.avatar_url,
        role: profile?.role || 'user',
        favorites: profile?.favorites || []
      };
      
      setUser(userData);

      // Lấy danh sách địa điểm yêu thích
      if (userData.favorites.length > 0) {
        const { data: placesData } = await supabase
          .from('places')
          .select('*')
          .in('id', userData.favorites);
          
        if (placesData) {
          setFavoritePlaces(placesData.map((p: any) => ({
            ...p,
            imageUrl: p.image_url,
            googleMapsUrl: p.google_maps_url
          })));
        }
      }
    };
    fetchUserAndFavorites();
  }, [router, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processAvatarFile = async (file: File) => {
    if (user) {
      if (file.size > 1024 * 1024) {
        setMessage({ type: "error", text: "Vui lòng chọn ảnh dưới 1MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        
        // Cập nhật metadata của user
        const { error } = await supabase.auth.updateUser({
          data: { avatar_url: result }
        });

        if (error) {
          setMessage({ type: "error", text: "Lỗi cập nhật ảnh: " + error.message });
          return;
        }

        setUser({ ...user, avatarUrl: result });
        setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processAvatarFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!user) return;

    if (!formData.currentPassword) {
      setMessage({ type: "error", text: "Vui lòng nhập mật khẩu hiện tại" });
      return;
    }

    // Xác thực mật khẩu cũ bằng cách thử đăng nhập lại
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: formData.currentPassword
    });

    if (verifyError) {
      setMessage({ type: "error", text: "Mật khẩu hiện tại không đúng" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu mới không khớp" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: formData.newPassword
    });
    
    if (error) {
      setMessage({ type: "error", text: "Lỗi đổi mật khẩu: " + error.message });
      return;
    }

    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage({ type: "success", text: "Đổi mật khẩu thành công" });
  };

  const handleEnroll2FA = async () => {
    setMessage({ type: "", text: "" });
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });

    if (error) {
      setMessage({ type: "error", text: "Lỗi khởi tạo 2FA: " + error.message });
      return;
    }

    setFactorId(data.id);
    // Sử dụng API tạo QR code đơn giản để hiển thị
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.totp.uri}`);
    setIsEnrolling2FA(true);
  };

  const handleVerify2FA = async () => {
    if (!verifyCode) return;

    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: data.id,
      code: verifyCode
    });

    if (verifyError) {
      setMessage({ type: "error", text: "Mã xác thực không đúng" });
    } else {
      setMessage({ type: "success", text: "Đã bật xác thực 2 lớp thành công!" });
      setIsEnrolling2FA(false);
      setVerifyCode("");
    }
  };

  const handleUnenroll2FA = async () => {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totpFactor = factors?.totp[0];
    
    if (totpFactor) {
      await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
      setMessage({ type: "success", text: "Đã tắt xác thực 2 lớp" });
      // Refresh page or state to update UI
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông tin tài khoản</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div 
                className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-md bg-white cursor-pointer transition-all duration-200 ${
                  isDragging ? 'border-primary-500 ring-4 ring-primary-100 scale-110' : 'border-white'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {user.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    fill 
                    className="object-cover" 
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email} • {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-600" />
            Đổi mật khẩu
          </h3>

          {message.text && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-600/20"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </form>

          {/* Phần Xác thực 2 lớp (2FA) */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              Xác thực 2 lớp (2FA)
            </h3>
            
            {!isEnrolling2FA ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 mb-3">
                  Tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác thực từ ứng dụng (Google Authenticator, Authy) khi đăng nhập.
                </p>
                <button
                  type="button"
                  onClick={handleEnroll2FA}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Bật xác thực 2 lớp
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" width={150} height={150} />}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h4 className="font-medium text-gray-900">Quét mã QR</h4>
                    <p className="text-sm text-gray-600">
                      Sử dụng ứng dụng Authenticator trên điện thoại để quét mã QR bên cạnh, sau đó nhập mã gồm 6 chữ số vào bên dưới.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        placeholder="Nhập mã 6 số"
                        className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-center tracking-widest font-mono"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerify2FA}
                        className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
                      >
                        Xác nhận
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEnrolling2FA(false)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phần hiển thị Địa điểm yêu thích */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-600" />
            Địa điểm yêu thích
          </h3>
        </div>
        <div className="p-6">
          {favoritePlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoritePlaces
                .map((place: any) => (
                  <Link
                    href={`/places/${place.id}`}
                    key={place.id}
                    className="flex gap-4 p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all group"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={place.imageUrl}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate group-hover:text-primary-700">
                        {place.name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{place.address}</span>
                      </p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-600">
                        {place.category}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Bạn chưa lưu địa điểm yêu thích nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}