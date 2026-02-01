"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminUI() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
	const slug = name
	  .toLowerCase()
	  .replace(/\s+/g, "-")
	  .normalize("NFD")
	  .replace(/[\u0300-\u036f]/g, "");
  
	const { error } = await supabase.from("places").insert({
	  title: name,
	  slug,
	  description,
	  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
	  address: "Vũng Tàu",
	  category: "food", // hoặc checkin, place tùy bạn
	  featured: false,
	  order: 0,
	  tags: [],
	});
  
	if (error) alert(error.message);
	else {
	  alert("Đã thêm địa điểm!");
	  setName("");
	  setDescription("");
	}
  };
  

  return (
	<div className="w-full max-w-2xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 space-y-8 text-white">
	  <div>
		<h1 className="text-3xl font-bold tracking-tight">
		  Admin • Thêm địa điểm
		</h1>
		<p className="text-white/70 mt-2">
		  Địa điểm mới sẽ tự động xuất hiện ở các trang Food, Check-in, Places.
		</p>
	  </div>
  
	  <div className="space-y-5">
		<div className="space-y-2">
		  <label className="text-sm">Tên địa điểm</label>
		  <input
			className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-400 placeholder-white/50"
			placeholder="Ví dụ: Bánh khọt Cô Ba Vũng Tàu"
			value={name}
			onChange={(e) => setName(e.target.value)}
		  />
		</div>
  
		<div className="space-y-2">
		  <label className="text-sm">Mô tả</label>
		  <textarea
			rows={4}
			className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 placeholder-white/50"
			placeholder="Mô tả ngắn về địa điểm..."
			value={description}
			onChange={(e) => setDescription(e.target.value)}
		  />
		</div>
  
		<button
		  onClick={handleAdd}
		  disabled={loading}
		  className="w-full rounded-xl bg-white text-black py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
		>
		  {loading ? "Đang thêm..." : "Thêm địa điểm"}
		</button>
	  </div>
	</div>
  );
}
