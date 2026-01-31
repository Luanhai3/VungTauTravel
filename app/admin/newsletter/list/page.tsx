"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/utils/supabase/client";
import { Calendar, CheckCircle, Clock, XCircle, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Newsletter {
  id: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  scheduled_at: string | null;
  created_at: string;
}

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 px-6 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
}

export default function NewsletterListPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    const fetchNewsletters = async () => {
      setIsLoading(true);
      let query = supabase
        .from('newsletters')
        .select('*', { count: 'exact' });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (data) {
        setNewsletters(data);
        setTotalCount(count || 0);
      }
      setIsLoading(false);
    };

    fetchNewsletters();
  }, [supabase, filterStatus, currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> Đã gửi</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3" /> Thất bại</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" /> Chờ gửi</span>;
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Danh sách Newsletter</h1>
            <p className="text-gray-600 mt-1">Quản lý các bản tin đã gửi và lên lịch.</p>
          </div>
          <Link 
            href="/admin/newsletter" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Soạn mới
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="w-5 h-5" />
            <span className="text-sm font-medium">Lọc theo trạng thái:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Tất cả', 'pending', 'sent', 'failed'].map((status) => {
              const isAll = status === 'Tất cả';
              const isActive = isAll ? filterStatus === null : filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(isAll ? null : status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isAll ? 'Tất cả' : (status === 'pending' ? 'Chờ gửi' : status === 'sent' ? 'Đã gửi' : 'Thất bại')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Tiêu đề</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Lên lịch gửi</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-0"><TableSkeleton /></td>
                  </tr>
                ) : newsletters.length > 0 ? (
                  newsletters.map((item) => (
                      <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.subject}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4">
                          {item.scheduled_at ? (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {new Date(item.scheduled_at).toLocaleString('vi-VN')}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Gửi ngay</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(item.created_at).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Chưa có newsletter nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-500">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
