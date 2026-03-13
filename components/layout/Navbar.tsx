"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
Search,
Hotel,
Utensils,
Car,
Gamepad2,
Menu,
X
} from "lucide-react"

const travelData = [
{
name:"Bãi Sau",
type:"Điểm du lịch",
image:"/search/baisau.jpg",
link:"/dia-diem/bai-sau"
},
{
name:"Hồ Mây Park",
type:"Vui chơi",
image:"/search/homay.jpg",
link:"/dia-diem/ho-may"
},
{
name:"Marina Club",
type:"Nhà hàng",
image:"/search/marina.jpg",
link:"/dich-vu/an-uong/marina"
},
{
name:"Pullman Hotel",
type:"Khách sạn",
image:"/search/pullman.jpg",
link:"/dich-vu/luu-tru/pullman"
}
]

export default function Navbar(){

const [serviceOpen,setServiceOpen] = useState(false)
const [searchOpen,setSearchOpen] = useState(false)
const [mobileOpen,setMobileOpen] = useState(false)
const [mobileService,setMobileService] = useState(false)

const [query,setQuery] = useState("")

const results = travelData.filter(item =>
item.name.toLowerCase().includes(query.toLowerCase())
)

return(

<>

{/* NAVBAR */}

<nav className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur border-b">

<div className="relative flex items-center justify-between h-[72px] max-w-7xl mx-auto px-6">

{/* LOGO */}

<Link
href="/"
className="absolute left-6 top-0 w-[130px] h-[130px]"
>

<Image
src="/logovttravel.jpg"
alt="VungTauTravel"
fill
className="object-contain"
/>

</Link>

{/* DESKTOP MENU */}

<div className="hidden md:flex items-center gap-12 ml-[160px] text-[14px] font-semibold uppercase tracking-wider text-gray-700">

<Link href="/" className="hover:text-sky-600 transition">
TRANG CHỦ
</Link>

<Link href="/gioi-thieu" className="hover:text-sky-600 transition">
Giới thiệu
</Link>

{/* SERVICE */}

<div
className="relative"
onMouseEnter={()=>setServiceOpen(true)}
onMouseLeave={()=>setServiceOpen(false)}
>

<button className="flex items-center gap-1 hover:text-sky-600 transition">

DỊCH VỤ

<svg
className={`w-4 h-4 transition ${serviceOpen ? "rotate-180":""}`}
viewBox="0 0 20 20"
fill="currentColor"
>
<path d="M5 7l5 5 5-5"/>
</svg>

</button>

<AnimatePresence>

{serviceOpen && (

<motion.div
initial={{opacity:0,y:10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
className="absolute top-10 left-0 w-[210px] bg-white border rounded-xl shadow-lg overflow-hidden"
>

<DesktopItem href="/dich-vu/luu-tru" icon={<Hotel size={18}/>}>
Lưu trú
</DesktopItem>

<DesktopItem href="/dich-vu/an-uong" icon={<Utensils size={18}/>}>
Ăn uống
</DesktopItem>

<DesktopItem href="/dich-vu/vui-choi" icon={<Gamepad2 size={18}/>}>
Vui chơi
</DesktopItem>

<DesktopItem href="/dich-vu/van-chuyen" icon={<Car size={18}/>}>
Vận chuyển
</DesktopItem>

</motion.div>

)}

</AnimatePresence>

</div>

<Link href="/dia-diem" className="hover:text-sky-600 transition">
Địa điểm
</Link>

<Link href="/tin-tuc" className="hover:text-sky-600 transition">
Tin tức
</Link>

<Link href="/lien-he" className="hover:text-sky-600 transition">
Liên hệ
</Link>

</div>

{/* RIGHT SIDE */}

<div className="flex items-center gap-3 ml-auto">

{/* SEARCH */}

<button
onClick={()=>setSearchOpen(true)}
className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-sky-100 text-sky-600 transition"
>
<Search size={20}/>
</button>

{/* MOBILE MENU BUTTON */}

<button
onClick={()=>setMobileOpen(true)}
className="md:hidden w-10 h-10 flex items-center justify-center text-sky-600"
>
<Menu size={26}/>
</button>

</div>

</div>

</nav>

{/* MOBILE MENU */}

<AnimatePresence>

{mobileOpen && (

<motion.div
initial={{x:"100%"}}
animate={{x:0}}
exit={{x:"100%"}}
transition={{type:"spring",stiffness:120}}
className="fixed inset-0 z-50 bg-gradient-to-br from-sky-600 to-blue-900 text-white"
>

<div className="flex justify-between items-center px-6 py-6">

<span className="font-bold text-lg">
VungTau Travel
</span>

<button onClick={()=>setMobileOpen(false)}>
<X size={28}/>
</button>

</div>

<div className="flex flex-col text-lg px-6 gap-6">

<Link href="/" onClick={()=>setMobileOpen(false)}>
Trang chủ
</Link>

<Link href="/gioi-thieu" onClick={()=>setMobileOpen(false)}>
Giới thiệu
</Link>

{/* MOBILE SERVICE */}

<button
onClick={()=>setMobileService(!mobileService)}
className="flex justify-between items-center"
>
Dịch vụ
<span>{mobileService ? "−" : "+"}</span>
</button>

<AnimatePresence>

{mobileService && (

<motion.div
initial={{height:0,opacity:0}}
animate={{height:"auto",opacity:1}}
exit={{height:0}}
className="flex flex-col gap-4 pl-4 text-sky-200"
>

<Link href="/dich-vu/luu-tru">Khách sạn</Link>
<Link href="/dich-vu/an-uong">Ăn uống</Link>
<Link href="/dich-vu/vui-choi">Vui chơi</Link>
<Link href="/dich-vu/van-chuyen">Vận chuyển</Link>

</motion.div>

)}

</AnimatePresence>

<Link href="/dia-diem" onClick={()=>setMobileOpen(false)}>
Địa điểm
</Link>

<Link href="/tin-tuc" onClick={()=>setMobileOpen(false)}>
Tin tức
</Link>

<Link href="/lien-he" onClick={()=>setMobileOpen(false)}>
Liên hệ
</Link>

</div>

</motion.div>

)}

</AnimatePresence>

{/* SEARCH OVERLAY */}

<AnimatePresence>

{searchOpen && (

<>
<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
onClick={()=>setSearchOpen(false)}
/>

<motion.div
initial={{y:-120,opacity:0}}
animate={{y:0,opacity:1}}
exit={{y:-120,opacity:0}}
className="fixed top-0 left-0 w-full bg-white z-50 shadow-xl"
>

<div className="max-w-4xl mx-auto px-6 py-8">

<div className="flex items-center gap-4 border border-sky-200 bg-sky-50 rounded-xl px-4 py-3">

<Search className="text-sky-500"/>

<input
autoFocus
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Tìm khách sạn, quán ăn, địa điểm..."
className="w-full bg-transparent outline-none text-lg text-gray-800"
/>

<button
onClick={()=>setSearchOpen(false)}
className="text-gray-500 hover:text-red-500 text-xl"
>
✕
</button>

</div>

{query && (

<div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

{results.map((item,index)=>(

<Link
key={index}
href={item.link}
onClick={()=>setSearchOpen(false)}
className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
>

<Image
src={item.image}
alt={item.name}
width={60}
height={60}
className="rounded-lg object-cover"
/>

<div>

<div className="font-medium text-gray-800">
{item.name}
</div>

<div className="text-sm text-sky-600">
{item.type}
</div>

</div>

</Link>

))}

</div>

)}

</div>

</motion.div>

</>

)}

</AnimatePresence>

</>

)

}

function DesktopItem({href,icon,children}:any){

return(

<Link
href={href}
className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
>

{icon}
{children}

</Link>

)

}