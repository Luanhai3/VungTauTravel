"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2, Star, MapPin, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseBrowser } from "@/utils/supabase/client";

export default function PlaceTable({ places }: { places: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const itemsPerPage = 5;
  const supabase = getSupabaseBrowser();

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa điểm này?")) return;
    setDeletingId(id);
    
    const { error } = await supabase.from('places').delete().eq('id', id);
    
    if (error) {
      alert("Lỗi khi xóa: " + error.message);
    } else {
      // Refresh page to update list
      window.location.reload();
    }
    setDeletingId(null);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlaces = [...places].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aValue = a[key];
    let bValue = b[key];

    // Xử lý null/undefined và chuyển về string để so sánh
    if (aValue === null || aValue === undefined) aValue = "";
    if (bValue === null || bValue === undefined) bValue = "";
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(places.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlaces = sortedPlaces.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Hình ảnh</th>
              <th 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Tên địa điểm
                  {sortConfig?.key === 'name' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary-600" /> : <ArrowDown className="w-4 h-4 text-primary-600" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Danh mục
                  {sortConfig?.key === 'category' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary-600" /> : <ArrowDown className="w-4 h-4 text-primary-600" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3">Địa chỉ</th>
              <th 
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Ngày tạo
                  {sortConfig?.key === 'created_at' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary-600" /> : <ArrowDown className="w-4 h-4 text-primary-600" />
                  ) : (
                    <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentPlaces.map((place) => (
              <tr key={place.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {place.image_url && (
                      <Image 
                        src={place.image_url} 
                        alt={`Thumbnail ${place.name}`} 
                        title={place.name}
                        fill 
                        className="object-cover" 
                        unoptimized 
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    {place.name}
                    {place.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">ID: {place.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {place.category}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={place.address}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {place.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                  {place.created_at ? new Date(place.created_at).toLocaleDateString('vi-VN') : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/places/${place.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(place.id)}
                      disabled={deletingId === place.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    >
                      {deletingId === place.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {places.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, places.length)}
            </span>{" "}
            trong số <span className="font-medium">{places.length}</span> địa điểm
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}