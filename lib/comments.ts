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
    .select("*")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  if (data && data.length > 0) {
    // Filter for valid UUIDs to avoid 400 Bad Request from Postgres
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const userIds = Array.from(new Set(data.map((c) => c.user_id)))
      .filter((id) => typeof id === 'string' && uuidRegex.test(id));
    
    if (userIds.length === 0) return data as Comment[];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, name, avatar_url")
      .in("id", userIds);

    const profilesMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, any>);

    return data.map((comment) => ({
      ...comment,
      profiles: profilesMap[comment.user_id] || {
        email: "Người dùng ẩn danh",
        name: "Người dùng ẩn danh"
      },
    })) as Comment[];
  }

  return [];
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
        // rating,
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

// Lấy điểm đánh giá trung bình từ database
export async function getAverageRating(placeId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("rating")
    .eq("place_id", placeId);

  if (error || !data || data.length === 0) return 0;

  const sum = data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  return Number((sum / data.length).toFixed(1));
}