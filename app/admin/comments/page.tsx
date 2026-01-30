import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CommentTable from "../comment-table";

export default async function CommentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Check admin
  let isAdmin = false;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role === 'admin') {
    isAdmin = true;
  }

  if (!isAdmin) {
    return redirect("/");
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Lỗi: {error.message}</div>;
  }

  // Lấy danh sách place_id duy nhất
  const placeIds = Array.from(new Set(comments.map(c => c.place_id)));
  
  // Fetch thông tin places
  const { data: places } = await supabase
    .from('places')
    .select('id, name')
    .in('id', placeIds);

  const placeMap = new Map(places?.map(p => [p.id, p.name]));

  const formattedComments = comments.map(comment => ({
    ...comment,
    place_name: placeMap.get(comment.place_id) || "Địa điểm không tồn tại"
  }));

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Quản lý bình luận</h1>
          <p className="text-gray-600 mt-1">Duyệt và xóa các bình luận vi phạm tiêu chuẩn cộng đồng.</p>
        </div>
        <CommentTable comments={formattedComments} />
      </div>
    </div>
  );
}
