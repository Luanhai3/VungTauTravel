"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, Upload, Image as ImageIcon, X, Lock, Trash2, Check, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseBrowser } from "@/utils/supabase/client";
import { resizeImage, getCroppedImg } from "@/utils/image";
import Cropper, { Area } from "react-easy-crop";

interface PlaceFormProps {
  place?: any;
  isEdit?: boolean;
}

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

export default function PlaceForm({ place, isEdit = false }: PlaceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(place?.image_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const supabase = getSupabaseBrowser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [name, setName] = useState(place?.name || "");
  const [slug, setSlug] = useState(place?.id || "");
  const [existingGallery, setExistingGallery] = useState<string[]>(place?.gallery_images || []);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email === 'hoangthienluan17@gmail.com') {
          setIsAdmin(true);
          setIsCheckingAuth(false);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profile?.role === 'admin') {
            setIsAdmin(true);
            setIsCheckingAuth(false);
          } else {
            router.push("/forbidden");
          }
        }
      } else {
        router.push("/admin/login");
      }
    };
    checkRole();
  }, [supabase, router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    let imageUrl = place?.image_url || "";

    // Nếu không có previewUrl (đã bị xóa) và không có file mới, đặt imageUrl là rỗng
    if (!previewUrl && !imageFile) {
      imageUrl = "";
    }

    // Upload ảnh nếu có file mới được chọn
    if (imageFile) {
      if (!isAdmin) {
        setError("Bạn không có quyền tải ảnh lên. Chỉ Admin mới được thực hiện thao tác này.");
        setLoading(false);
        return;
      }

      // Bắt đầu giả lập tiến trình
      setUploadProgress(10);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      // Resize ảnh về tối đa 1200px chiều rộng để tối ưu
      const resizedFile = await resizeImage(imageFile, 1200);

      const fileName = `${Date.now()}-${resizedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, resizedFile);
      
      clearInterval(progressInterval);

      if (uploadError) {
        setUploadProgress(0);
        setError("Lỗi upload ảnh: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      setUploadProgress(100);
      imageUrl = publicUrl;
    }

    // Upload gallery images
    const uploadedGalleryUrls: string[] = [];
    if (newGalleryFiles.length > 0) {
      for (const file of newGalleryFiles) {
        const resizedFile = await resizeImage(file, 1200);
        const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}-${resizedFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(fileName, resizedFile);
        
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
          uploadedGalleryUrls.push(publicUrl);
        }
      }
    }

    // Combine existing and new gallery images
    const finalGallery = [...existingGallery, ...uploadedGalleryUrls];

    const data = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      address: formData.get("address") as string,
      image_url: imageUrl,
      description: formData.get("description") as string,
      google_maps_url: formData.get("google_maps_url") as string,
      is_featured: formData.get("is_featured") === "on",
      opening_hours: formData.get("opening_hours") as string,
      best_time: formData.get("best_time") as string,
      gallery_images: finalGallery,
    };
    
    let result;
    
    if (isEdit) {
      const { error: updateError } = await supabase
        .from('places')
        .update(data)
        .eq('id', place.id);
      result = { success: !updateError, message: updateError?.message };
    } else {
      const { error: insertError } = await supabase
        .from('places')
        .insert([data]);
      result = { success: !insertError, message: insertError?.message };
    }

    if (result.success) {
      router.push("/admin/places");
      router.refresh();
    } else {
      setError(result.message || "Có lỗi xảy ra");
      setLoading(false);
    }
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
        setError("Lỗi khi cắt ảnh");
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
      // Reset input value để có thể chọn lại cùng file nếu muốn
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

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewGalleryFiles(prev => [...prev, ...files]);
      // Reset input
      e.target.value = "";
    }
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ID (Slug)</label>
          <input
            name="id"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            readOnly={isEdit}
            required
            placeholder="vi-du-slug-dia-diem"
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${isEdit ? 'bg-gray-100 text-gray-500' : ''}`}
          />
          <p className="text-xs text-gray-500">Định danh duy nhất, không dấu, nối bằng gạch ngang.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tên địa điểm</label>
          <input 
            name="name" 
            value={name} 
            onChange={handleNameChange} 
            required 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Danh mục</label>
          <select name="category" defaultValue={place?.category || "Check-in"} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="Check-in">Check-in</option>
            <option value="Ăn uống">Ăn uống</option>
            <option value="Du lịch">Du lịch</option>
            <option value="Hẹn hò">Hẹn hò</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
          <input name="address" defaultValue={place?.address} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Hình ảnh</label>
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
                  alt="Xem trước hình ảnh địa điểm đang tải lên"
                  title="Hình ảnh địa điểm"
                  fill 
                  className="object-cover" 
                  unoptimized={previewUrl.startsWith('blob:')}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Thay đổi hình ảnh</span>
                    </div>
                  </div>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-full shadow-sm hover:bg-red-50 transition-colors z-10"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Thư viện ảnh (Gallery)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing Images */}
            {existingGallery.map((url, index) => (
              <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                <Image src={url} alt="Gallery" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeExistingGalleryImage(index)}
                  className="absolute top-1 right-1 p-1.5 bg-white/90 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* New Images Previews */}
            {newGalleryFiles.map((file, index) => (
              <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden group border border-primary-200 ring-2 ring-primary-100">
                <Image src={URL.createObjectURL(file)} alt="New Gallery" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeNewGalleryImage(index)}
                  className="absolute top-1 right-1 p-1.5 bg-white/90 text-red-600 rounded-full shadow-sm hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-primary-600 text-white text-[10px] py-0.5 text-center">
                  Mới
                </div>
              </div>
            ))}

            {/* Add Button */}
            <div 
              onClick={() => isAdmin && galleryInputRef.current?.click()}
              className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${isAdmin ? 'border-gray-300 hover:border-primary-500 hover:bg-primary-50 cursor-pointer text-gray-500 hover:text-primary-600' : 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-300'}`}
            >
              <Plus className="w-8 h-8" />
              <span className="text-xs font-medium">Thêm ảnh</span>
            </div>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleGalleryChange}
            className="hidden"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Mô tả chi tiết</label>
          <textarea name="description" defaultValue={place?.description} rows={5} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Giờ mở cửa</label>
          <input 
            name="opening_hours" 
            defaultValue={place?.opening_hours} 
            placeholder="Ví dụ: Mở cửa cả ngày (Thời gian có thể thay đổi vào ngày lễ)"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Thời điểm lý tưởng</label>
          <input 
            name="best_time" 
            defaultValue={place?.best_time} 
            placeholder="Ví dụ: Quanh năm. Đẹp nhất vào mùa khô (Tháng 11 - Tháng 4)"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Google Maps URL</label>
          <input name="google_maps_url" defaultValue={place?.google_maps_url} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" name="is_featured" id="is_featured" defaultChecked={place?.is_featured} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
          <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Đặt làm địa điểm nổi bật</label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <Link href="/admin/places" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Lưu thay đổi" : "Thêm địa điểm"}
        </button>
      </div>

      {/* Crop Modal */}
      {isCropping && cropImageSrc && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-[60vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3} // Tỷ lệ khung hình mong muốn (ví dụ 4:3)
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex flex-col items-center">
              <span className="text-white text-sm mb-1">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-48"
              />
            </div>
            <button
              type="button"
              onClick={performCrop}
              className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Xác nhận cắt
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
    </form>
  );
}