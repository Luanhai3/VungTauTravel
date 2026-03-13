import Image from "next/image"

export default function PolicyLayout({
title,
description,
children
}:{
title:string
description:string
children:React.ReactNode
}){

return(

<main className="bg-white text-zinc-800">

{/* HERO */}

<section className="relative h-[320px] flex items-center justify-center text-center">

<Image
src="/footer.jpg"
alt="Vung Tau coast"
fill
className="object-cover"
/>

<div className="absolute inset-0 bg-black/50"/>

<div className="relative z-10 max-w-3xl px-6 text-white">

<h1 className="text-4xl md:text-5xl font-serif mb-4">
{title}
</h1>

<p className="text-zinc-200">
{description}
</p>

</div>

</section>


{/* CONTENT */}

<section className="max-w-4xl mx-auto px-6 py-20 leading-relaxed space-y-8">

{children}

</section>

</main>

)

}