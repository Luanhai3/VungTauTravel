"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative text-zinc-200 overflow-hidden">

<div className="absolute inset-0">

<Image
src="/footer.jpg"
alt="Vung Tau beach"
fill
priority
className="object-cover hidden md:block"
/>

<Image
src="/footer.jpg"
alt="Vung Tau beach"
fill
priority
className="object-contain md:hidden bg-black"
/>

<div className="absolute inset-0 bg-black/70"></div>

</div>

<div className="relative max-w-7xl mx-auto px-6 py-16">

<div className="grid md:grid-cols-4 gap-12">

{/* BRAND */}

<div>

<h2 className="text-3xl font-semibold text-white mb-4">
VungTauTravel
</h2>

<p className="text-zinc-300 text-sm leading-relaxed">
Khám phá những bãi biển tuyệt đẹp, hải sản tươi ngon
và nhịp sống biển yên bình của thành phố Vũng Tàu.
</p>

</div>


{/* LINKS */}

<div>

<h3 className="text-white font-semibold mb-4">
Khám Phá
</h3>

<ul className="space-y-2 text-sm">

<li>
<Link href="/" className="hover:text-white">
Trang Chủ
</Link>
</li>

<li>
<Link href="/gioi-thieu" className="hover:text-white">
Giới Thiệu
</Link>
</li>

<li>
<Link href="/dia-diem" className="hover:text-white">
Địa Điểm
</Link>
</li>

<li>
<Link href="/dich-vu" className="hover:text-white">
Dịch Vụ
</Link>
</li>

</ul>

</div>


{/* POLICIES */}

<div>

<h3 className="text-white font-semibold mb-4">
Chính Sách
</h3>

<ul className="space-y-2 text-sm">

<li>
<Link href="/chinh-sach-bao-mat" className="hover:text-white">
Chính sách bảo mật
</Link>
</li>

<li>
<Link href="/dieu-khoan-su-dung" className="hover:text-white">
Điều khoản sử dụng
</Link>
</li>

<li>
<Link href="/chinh-sach-cookie" className="hover:text-white">
Chính sách Cookie
</Link>
</li>

<li>
<Link href="/chinh-sach-hoan-tien" className="hover:text-white">
Chính sách hoàn tiền
</Link>
</li>

<li>
<Link href="/lien-he-khieu-nai" className="hover:text-white">
Liên hệ & khiếu nại
</Link>
</li>

</ul>

</div>


{/* SOCIAL */}

<div>

<h3 className="text-white font-semibold mb-4">
Follow Us
</h3>

<div className="flex gap-4">

<a className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition">
<Instagram size={18}/>
</a>

<a className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition">
<Facebook size={18}/>
</a>

<a className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition">
<Twitter size={18}/>
</a>

</div>

</div>

</div>


<div className="border-t border-white/20 mt-12 pt-6 text-sm text-zinc-400 text-center">
© {new Date().getFullYear()} VungTauTravel | Design by Louis Hoang
</div>

</div>

</footer>
  )
}