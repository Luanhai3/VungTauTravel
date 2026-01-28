import { createClient } from "@/utils/supabase/client";

export type Comment = {
  id: string;
  place_id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
  profiles?: {
    email: string;
    name?: string;
    avatar_url?: string;
  };
};

const supabase = createClient();

// Lấy danh sách bình luận của một địa điểm
export async function getCommentsByPlace(placeId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        email,
        name,
        avatar_url
      )
    `)
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return data as Comment[];
}

// Thêm bình luận mới
export async function addComment(placeId: string, content: string, rating: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Bạn cần đăng nhập để bình luận");

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        place_id: placeId,
        user_id: user.id,
        content,
        rating,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Xóa bình luận
export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
  return true;
}

// Tính điểm đánh giá trung bình
export function calculateAverageRating(comments: Comment[]) {
  if (!comments.length) return 0;
  const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
  return (sum / comments.length).toFixed(1);
}