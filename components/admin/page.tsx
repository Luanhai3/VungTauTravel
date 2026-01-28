"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, deleteUser, User, getUserByUsername } from "@/lib/users";
import { Plus, Trash2, User as UserIcon, ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown, BarChart3, Download, Loader2 } from "lucide-react";
import UserModal from "@/components/admin/UserModal";
import { createClient } from "@/utils/supabase/client";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: "asc" | "desc" } | null>(null);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      if (user.email !== 'hoangthienluan17@gmail.com') {
        router.push("/");
        return;
      }
      setIsLoading(false);
      loadUsers();
    };
    checkUser();
  }, []);

  const loadUsers = () => {
    setUsers(getUsers());
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUser(id);
      loadUsers();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadUsers();
  };

  const handleSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    // @ts-ignore
    let aValue = a[key] || "";
    // @ts-ignore
    let bValue = b[key] || "";

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Họ tên", "Tên đăng nhập", "Vai trò"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(user => [
        user.id,
        `"${user.name.replace(/"/g, '""')}"`, // Escape quotes
        user.username,
        user.role
      ].join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Dữ liệu biểu đồ (6 tháng gần nhất)
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.getMonth();
    const year = d.getFullYear();
    
    const count = users.filter(u => {
      // @ts-ignore - Giả sử user có trường created_at
      const uDate = u.created_at ? new Date(u.created_at) : null;
      return uDate && uDate.getMonth() === month && uDate.getFullYear() === year;
    }).length;

    return { label: `T${month + 1}`, value: count };
  });
  const maxChartValue = Math.max(...chartData.map(d => d.value), 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">Thêm và xóa tài khoản quản trị</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            <Download className="w-5 h-5" />
            Xuất CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      {/* Dashboard Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              Thống kê đăng ký mới
            </h3>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="relative w-full flex justify-center items-end h-full bg-gray-50 rounded-t-lg overflow-hidden">
                  <div 
                    className="w-full max-w-[40px] bg-primary-500 hover:bg-primary-600 transition-all duration-500 rounded-t-md relative group-hover:shadow-lg"
                    style={{ height: `${(item.value / maxChartValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {item.value} người
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng người dùng</h3>
            <p className="text-3xl font-black text-gray-900">{users.length}</p>
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              <span>Đang hoạt động</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Vai trò Admin</h3>
            <p className="text-3xl font-black text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
            <div className="mt-2 text-sm text-gray-500">
              Tài khoản quản trị
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc username..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Người dùng
                    {sortConfig?.key === 'name' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary-600" /> : <ArrowDown className="w-4 h-4 text-primary-600" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tên đăng nhập
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group select-none"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-1">
                    Vai trò
                    {sortConfig?.key === 'role' ? (
                      sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 text-primary-600" /> : <ArrowDown className="w-4 h-4 text-primary-600" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "admin" ? "Quản trị viên" : "Biên tập viên"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700 p-2 transition-colors"
                      title="Xóa"
                      disabled={user.username === "admin"} // Prevent deleting default admin
                    >
                      <Trash2 className={`w-4 h-4 ${user.username === "admin" ? "opacity-50 cursor-not-allowed" : ""}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-500">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
              </span>{" "}
              trong số <span className="font-medium">{filteredUsers.length}</span> người dùng
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

      {isModalOpen && (
        <UserModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalClose}
        />
      )}
    </div>
  );
}