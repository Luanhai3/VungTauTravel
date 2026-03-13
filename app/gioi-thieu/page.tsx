"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage(){

const containerRef = useRef(null)
const canvasRef = useRef<HTMLCanvasElement>(null)

/* OCEAN CANVAS */

useEffect(()=>{

const canvas = canvasRef.current
if(!canvas) return

const ctx = canvas.getContext("2d")!

let w = canvas.width = window.innerWidth
let h = canvas.height = window.innerHeight

window.addEventListener("resize",()=>{
w = canvas.width = window.innerWidth
h = canvas.height = window.innerHeight
})

let t = 0

function draw(){

ctx.clearRect(0,0,w,h)

for(let i=0;i<40;i++){

const x = (i/40)*w
const y = h*0.75 + Math.sin(t+i*0.4)*40

ctx.beginPath()
ctx.arc(x,y,2,0,Math.PI*2)
ctx.fillStyle="rgba(14,165,233,0.35)"
ctx.fill()

}

ctx.beginPath()

for(let x=0;x<w;x++){

const y = h*0.82 + Math.sin(x*0.01+t)*25

if(x===0) ctx.moveTo(x,y)
else ctx.lineTo(x,y)

}

ctx.strokeStyle="rgba(14,165,233,0.3)"
ctx.lineWidth=2
ctx.stroke()

t += 0.03

requestAnimationFrame(draw)

}

draw()

},[])

return(

<main
ref={containerRef}
className="relative bg-gradient-to-b from-sky-50 via-white to-blue-50 text-slate-800 overflow-hidden"
>

{/* OCEAN CANVAS */}

<canvas
ref={canvasRef}
className="fixed inset-0 -z-20"
/>


{/* ================= ABOUT ================= */}

<section className="py-32">

<div className="text-center mb-20">

<motion.h2
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
viewport={{once:true}}
transition={{duration:0.8}}
className="text-4xl md:text-5xl font-light tracking-wide text-slate-800"
>
About <span className="text-emerald-500">VungTau Travel</span>
</motion.h2>

</div>


<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 px-6 items-center">


{/* LOGO */}

<motion.div
initial={{opacity:0,scale:0.9}}
whileInView={{opacity:1,scale:1}}
viewport={{once:true}}
transition={{duration:0.7}}
className="flex justify-center"
>

<div className="relative w-[260px] h-[260px] rounded-full overflow-hidden border border-slate-200 shadow-xl">

<Image
src="/logovttravel.jpg"
alt="VT Travel Logo"
fill
className="object-cover"
/>

</div>

</motion.div>



{/* TEXT */}

<motion.div
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
viewport={{once:true}}
transition={{duration:0.7}}
className="space-y-6 backdrop-blur-lg bg-white/80 border border-slate-200 rounded-2xl p-10 shadow-lg"
>

<h3 className="text-2xl font-semibold text-emerald-600">
Discover Vung Tau
</h3>

<p className="text-slate-600 leading-relaxed">
VungTau Travel là nền tảng giúp bạn khám phá thành phố biển
một cách hiện đại và thông minh.
</p>

<p className="text-slate-600 leading-relaxed">
Từ bãi biển đẹp, quán ăn địa phương đến những địa điểm check-in nổi tiếng,
tất cả đều được tổng hợp trong một hệ thống du lịch số.
</p>

<p className="text-slate-600 leading-relaxed">
Chúng tôi còn tích hợp AI để tạo lịch trình du lịch phù hợp
với thời gian và sở thích của từng du khách.
</p>

</motion.div>

</div>

</section>


{/* ================= GUIDE ================= */}

<section className="max-w-7xl mx-auto px-6 pb-40">

<div className="flex flex-col items-center text-center gap-6 mb-20">

<h2 className="text-4xl md:text-5xl font-light text-slate-800">
Easy Vũng Tàu Guide
</h2>

<p className="text-slate-600 max-w-3xl">
Vũng Tàu Travel cung cấp bản đồ, chỉ đường và các gợi ý hành trình
giúp bạn dễ dàng tìm đến những bãi biển đẹp, quán ăn địa phương
và các địa điểm tham quan nổi bật của thành phố.
</p>

<p className="text-slate-600 max-w-3xl">
Chúng tôi tập hợp những địa điểm đẹp nhất của Vũng Tàu,
từ các bãi biển nổi tiếng, quán cà phê có view biển
cho đến những quán ăn địa phương được người dân yêu thích.
</p>

<p className="text-slate-600 max-w-3xl">
Không chỉ là một trang web du lịch,
VungTau Travel còn là người bạn đồng hành
giúp bạn lên kế hoạch cho chuyến đi và tận hưởng
trọn vẹn từng khoảnh khắc tại thành phố biển.
</p>

</div>


<div className="relative w-full flex justify-center">


{/* IMAGE */}

<div
className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
style={{ maxWidth: "1200px" }}
>

<Image
src="/img-7.png"
alt="destination"
width={1200}
height={500}
className="object-cover"
/>

</div>



{/* FLOATING CARD */}

<div className="absolute bg-white py-6 px-6 rounded-3xl shadow-xl flex gap-4 left-[5%] top-10 border border-slate-200">

<Image
src="/meter.svg"
alt="meter"
width={50}
height={150}
/>

<div className="flex flex-col justify-between">

<div>

<div className="flex justify-between gap-10 text-sm text-slate-500">
<p>Xuất phát</p>
<p className="font-semibold text-emerald-600">2 giờ 52 phút</p>
</div>

<p className="font-bold text-lg mt-1">
TP Hồ Chí Minh
</p>

</div>


<div>

<p className="text-sm text-slate-500">
Điểm đến
</p>

<p className="font-bold text-lg mt-1">
VŨNG TÀU
</p>

</div>

</div>

</div>

</div>

</section>

</main>

)
}