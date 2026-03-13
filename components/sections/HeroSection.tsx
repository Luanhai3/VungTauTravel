"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function HeroSection() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [mouse,setMouse] = useState({x:0.5,y:0.5})

  /* ---------------- MOUSE PARALLAX ---------------- */

  useEffect(()=>{

    const move=(e:MouseEvent)=>{
      setMouse({
        x:e.clientX/window.innerWidth,
        y:e.clientY/window.innerHeight
      })
    }

    window.addEventListener("mousemove",move)

    return ()=>window.removeEventListener("mousemove",move)

  },[])


  /* ---------------- PARTICLES ---------------- */

  useEffect(()=>{

    const canvas = canvasRef.current
    if(!canvas) return

    const ctx = canvas.getContext("2d")!

    const resize=()=>{
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize",resize)

    const particles:any[]=[]

    for(let i=0;i<70;i++){
      particles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*2,
        speed:Math.random()*0.4+0.2
      })
    }

    const animate=()=>{

      ctx.clearRect(0,0,canvas.width,canvas.height)

      particles.forEach(p=>{

        p.y+=p.speed

        if(p.y>canvas.height){
          p.y=0
          p.x=Math.random()*canvas.width
        }

        ctx.beginPath()
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle="rgba(255,255,255,0.5)"
        ctx.fill()

      })

      requestAnimationFrame(animate)

    }

    animate()

  },[])


  const parallaxX = (mouse.x - 0.5) * 80
  const parallaxY = (mouse.y - 0.5) * 80

  return (

<section className="relative h-screen w-full overflow-hidden flex items-center">

{/* SKY LAYER */}

<motion.div
animate={{ x: parallaxX*0.3, y: parallaxY*0.3, scale:1.05 }}
transition={{ type:"spring", stiffness:20 }}
className="absolute inset-0"
>

<Image
src="/beach.jpg"
alt="sky"
fill
priority
className="object-cover"
/>

</motion.div>


{/* SEA LAYER */}

<motion.div
animate={{ x: parallaxX*0.6, y: parallaxY*0.6, scale:1.1 }}
transition={{ type:"spring", stiffness:25 }}
className="absolute inset-0"
>

<Image
src="https://images.unsplash.com/photo-1533760881669-80db4d7b4c15"
alt="sea"
fill
className="object-cover opacity-90"
/>

</motion.div>


{/* CLOUD LAYER */}

<motion.div
animate={{ x:[0,200,0] }}
transition={{ duration:80, repeat:Infinity }}
className="absolute inset-0 opacity-30"
style={{
background:
"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.3), transparent 50%)"
}}
/>


{/* LIGHT GLOW */}

<div
style={{
background:`radial-gradient(circle at ${mouse.x*100}% ${mouse.y*100}%, rgba(255,255,255,0.15), transparent 40%)`
}}
className="absolute inset-0 pointer-events-none"
/>


{/* PARTICLES */}

<canvas
ref={canvasRef}
className="absolute inset-0"
/>


{/* CINEMATIC GRADIENT */}

<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"/>


{/* CONTENT */}

<div className="relative z-10 max-w-7xl mx-auto px-6">

<motion.p
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{duration:0.8}}
className="uppercase tracking-[0.4em] text-white/70 text-xs mb-6"
>
Vietnam · Coastal Paradise
</motion.p>

<motion.h1
initial="hidden"
animate="visible"
variants={{
hidden:{},
visible:{transition:{staggerChildren:0.15}}
}}
className="text-white text-5xl md:text-7xl font-serif leading-[1.05] max-w-3xl"
>

{["Vung Tau","Riviera"].map((t,i)=>(
<motion.span
key={i}
variants={{
hidden:{opacity:0,y:50},
visible:{opacity:1,y:0}
}}
className="block"
>
{t}
</motion.span>
))}

</motion.h1>

<motion.p
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{delay:0.4}}
className="mt-8 text-zinc-200 text-base md:text-lg max-w-xl"
>
Golden beaches, fresh seafood markets and sunsets
painting the ocean. Vung Tau is the coastal retreat
where the city slows down.
</motion.p>


<motion.div
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{delay:0.6}}
className="mt-12 flex gap-6 flex-wrap"
>

<button className="px-10 py-4 bg-white text-black rounded-full hover:scale-105 transition">
Explore Beaches
</button>

<button className="px-10 py-4 border border-white text-white rounded-full hover:bg-white hover:text-black transition">
Travel Guide
</button>

</motion.div>

</div>


{/* FLOATING CARD */}

<motion.div
initial={{opacity:0,y:60}}
animate={{opacity:1,y:0}}
transition={{delay:1}}
className="absolute bottom-20 right-10 backdrop-blur-lg bg-white/10 border border-white/20 text-white p-6 rounded-2xl w-[240px] hidden md:block"
>

<p className="uppercase text-xs tracking-widest text-white/60">
Best Season
</p>

<h3 className="text-2xl mt-2 font-serif">
Dec — Apr
</h3>

<p className="text-sm text-white/70 mt-2">
Perfect weather for beaches and sunsets.
</p>

</motion.div>


{/* SCROLL INDICATOR */}

<motion.div
animate={{y:[0,10,0]}}
transition={{duration:2,repeat:Infinity}}
className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest"
>
SCROLL
</motion.div>

</section>

  )
}