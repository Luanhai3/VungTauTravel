"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Image as ImageIcon, Star, Lock, Trash2, Check } from "lucide-react";
import { Place, Category } from "@/lib/data";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { resizeImage, getCroppedImg } from "@/utils/image";
import Cropper, { Area } from "react-easy-crop";

interface PlaceModalProps {
  place: Place | null;
  onClose: () => void;
  onSave: () => void;
}

const categories: Category[] = ["Ăn uống", "Hẹn hò", "Check-in", "Du lịch"];

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export default function PlaceModal({ place, onClose, onSave }: PlaceModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "Ăn uống" as Category,
    imageUrl: "",
    description: "",
    address: "",
    googleMapsUrl: "",
    isFeatured: false,
    openingHours: "",
    bestTime: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email === 'hoangthienluan17@gmail.com') {
          setIsAdmin(true);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          if (profile?.role === 'admin') setIsAdmin(true);
        }
      }
    };
    checkRole();
  }, [supabase]);

  useEffect(() => {
    if (place) {
      setFormData({
        id: place.id,
        name: place.name,
        category: place.category,
        imageUrl: place.imageUrl,
        description: place.description,
        address: place.address,
        googleMapsUrl: place.googleMapsUrl,
        isFeatured: place.isFeatured || false,
        openingHours: place.openingHours || "",
        bestTime: place.bestTime || "",
      });
      setPreviewUrl(place.imageUrl);
    }
  }, [place]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "name" && !place) {
        newData.id = generateSlug(value);
      }
      return newData;
    });
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const performCrop = async () => {
    if (cropImageSrc && croppedAreaPixels) {
      try {
        const croppedFile = await getCroppedImg(cropImageSrc, croppedAreaPixels, "cropped-image.jpg");
        setImageFile(croppedFile);
        setPreviewUrl(URL.createObjectURL(croppedFile));
        setIsCropping(false);
        setCropImageSrc(null);
      } catch (e) {
        console.error(e);
        alert("Lỗi khi cắt ảnh");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropImageSrc(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isAdmin) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isAdmin) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropImageSrc(reader.result as string);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl && !formData.imageUrl) {
      alert("Vui lòng chọn hình ảnh");
      return;
    }

    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      if (!isAdmin) {
        alert("Bạn không có quyền tải ảnh lên. Chỉ Admin mới được thực hiện thao tác này.");
        return;
      }

      // Bắt đầu giả lập tiến trình
      setUploadProgress(10);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      // Resize ảnh trước khi upload
      const resizedFile = await resizeImage(imageFile, 1200);

      const fileName = `${Date.now()}-${resizedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, resizedFile);
      
      clearInterval(progressInterval);

      if (uploadError) {
        setUploadProgress(0);
        alert("Lỗi upload ảnh: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      setUploadProgress(100);
      finalImageUrl = publicUrl;
    }

    const dataToSave = {
      id: formData.id || generateSlug(formData.name),
      name: formData.name,
      category: formData.category,
      image_url: finalImageUrl,
      description: formData.description,
      address: formData.address,
      google_maps_url: formData.googleMapsUrl,
      is_featured: formData.isFeatured,
      opening_hours: formData.openingHours,
      best_time: formData.bestTime,
    };

    if (place) {
      const { error } = await supabase
        .from('places')
        .update(dataToSave)
        .eq('id', place.id);
      if (error) {
        alert("Lỗi cập nhật: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('places')
        .insert([dataToSave]);
      if (error) {
        alert("Lỗi thêm mới: " + error.message);
        return;
      }
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">
            {place ? "Sửa địa điểm" : "Thêm địa điểm mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh
            </label>
            <div 
              className={`relative aspect-video w-full rounded-xl border-2 border-dashed ${isAdmin ? (isDragging ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' : 'border-gray-300 cursor-pointer hover:border-primary-500 hover:bg-primary-50') : 'border-gray-200 bg-gray-50 cursor-not-allowed'} flex flex-col items-center justify-center transition-all overflow-hidden group`}
              onClick={() => isAdmin && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <>
                  <Image 
                    src={previewUrl} 
                    alt="Xem trước hình ảnh địa điểm"
                    title="Hình ảnh địa điểm"
                    fill 
                    className="object-cover" 
                    unoptimized={previewUrl.startsWith('blob:')}
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  {isAdmin && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-white flex flex-col items-center">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Thay đổi hình ảnh</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  {isAdmin ? (
                    <>
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                      <span className="text-xs mt-1">Hoặc kéo thả ảnh vào đây</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-12 h-12 mb-2 text-gray-300" />
                      <span className="text-sm font-medium">Chỉ Admin mới được thêm ảnh</span>
                    </>
                  )}
                </div>
              )}
              {isAdmin && <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />}
            </div>
            {/* Thanh tiến trình */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2 overflow-hidden">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                formData.isFeatured 
                  ? "bg-yellow-50 border-yellow-200 text-yellow-700" 
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Star className={`w-5 h-5 ${formData.isFeatured ? "fill-yellow-500 text-yellow-500" : ""}`} />
              <span className="font-medium">Đánh dấu là địa điểm nổi bật</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ID (Slug)
              </label>
              <input
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50"
                placeholder="tu-dong-tao-tu-ten"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tên địa điểm
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Nhập tên địa điểm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Danh mục
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="Mô tả ngắn về địa điểm..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Giờ mở cửa
              </label>
              <input
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Ví dụ: 8:00 - 22:00"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Thời điểm lý tưởng
              </label>
              <input
                name="bestTime"
                value={formData.bestTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Ví dụ: Mùa khô"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Địa chỉ cụ thể"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Google Maps URL
            </label>
            <input
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="https://maps.google.com/..."
              required
            />
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
              className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
            >
              {place ? "Lưu thay đổi" : "Thêm địa điểm"}
            </button>
          </div>
        </form>
      </div>

      {/* Crop Modal Overlay */}
      {isCropping && cropImageSrc && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-[60vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex items-center gap-4 mt-6 bg-gray-800 p-4 rounded-xl">
            <div className="flex flex-col items-center">
              <span className="text-white text-xs mb-1 font-medium uppercase tracking-wider">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 accent-primary-500"
              />
            </div>
            <div className="h-8 w-px bg-gray-600 mx-2"></div>
            <button
              type="button"
              onClick={performCrop}
              className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Cắt ảnh
            </button>
            <button
              type="button"
              onClick={() => { setIsCropping(false); setCropImageSrc(null); }}
              className="px-6 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}