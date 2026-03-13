"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function DiscoverSection() {

  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end","end start"]
  })

  const y = useTransform(scrollYProgress,[0,1],[80,-80])

  return (

<section
ref={ref}
className="relative w-full py-24 md:py-36 overflow-hidden"
style={{background:"#F0FFF0"}}
>

{/* decorative glow */}

<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#2E7D6B]/10 blur-[120px] rounded-full pointer-events-none"/>


{/* CONTAINER */}

<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

{/* TEXT SIDE */}

<motion.div
initial={{opacity:0,y:60}}
whileInView={{opacity:1,y:0}}
transition={{duration:0.9}}
viewport={{once:true}}
className="md:col-span-5 z-10"
>

<p className="uppercase tracking-[0.4em] text-xs text-[#5F6F5F] mb-6">
Khám phá
</p>

<h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-[#1F2D1F]">
Thành phố biển <br/>
đầy cảm hứng
</h2>

<div className="w-16 h-[2px] bg-[#2E7D6B] mb-6"/>

<p className="text-[#5F6F5F] leading-relaxed mb-6">
Vũng Tàu không chỉ là một điểm đến nghỉ dưỡng cuối tuần. 
Nơi đây là sự hòa quyện giữa những cung đường ven biển tuyệt đẹp,
những ngọn đồi nhìn ra đại dương và nền ẩm thực hải sản phong phú
đã trở thành dấu ấn đặc trưng của thành phố.
</p>

<p className="text-[#5F6F5F] leading-relaxed mb-10">
Dạo bước dọc bờ biển, khám phá những quán cà phê ẩn mình
và cảm nhận nhịp sống chậm rãi của một thành phố biển
được yêu mến bởi cả du khách lẫn người dân địa phương.
</p>

<button className="px-8 py-4 rounded-full bg-[#2E7D6B] text-white hover:bg-[#256457] transition">
Khám phá các địa điểm
</button>

</motion.div>


{/* IMAGE SIDE */}

<div className="relative md:col-span-7 h-[420px] md:h-[560px]">

{/* main image */}

<motion.div
style={{y}}
className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
>

<Image
src="/sunvt.png"
alt="Bình Minh Vũng Tàu"
fill
sizes="(max-width:768px) 100vw, 50vw"
className="object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-t from-[#1F2D1F]/30 to-transparent"/>

</motion.div>


{/* floating secondary image */}

<motion.div
initial={{opacity:0,scale:0.9}}
whileInView={{opacity:1,scale:1}}
transition={{delay:0.3,duration:0.8}}
viewport={{once:true}}
className="
absolute
-bottom-10
left-6
md:left-16
w-[180px]
md:w-[260px]
h-[120px]
md:h-[170px]
rounded-2xl
overflow-hidden
shadow-xl
border
border-[#D6EEDD]
"
>

<Image
src="/beach.jpg"
alt="Bãi biển nhiệt đới"
fill
className="object-cover"
/>

</motion.div>


{/* glass info card */}

<motion.div
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
transition={{delay:0.4}}
viewport={{once:true}}
className="
absolute
top-6
right-6
md:right-10
backdrop-blur-md
bg-white/70
border
border-[#D6EEDD]
p-5
rounded-2xl
w-[170px]
md:w-[220px]
shadow-lg
"
>

<p className="text-xs uppercase tracking-[0.3em] text-[#5F6F5F]">
Gợi ý du lịch
</p>

<h4 className="text-lg font-semibold mt-2 text-[#1F2D1F]">
Dạo biển lúc bình minh
</h4>

<p className="text-sm text-[#5F6F5F] mt-1">
Khung cảnh biển đẹp nhất thường xuất hiện trước 7 giờ sáng.
</p>

</motion.div>

</div>

</div>

</section>

  )

}