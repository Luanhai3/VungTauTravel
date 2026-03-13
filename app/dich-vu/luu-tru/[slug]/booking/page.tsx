"use client"

import { useState } from "react"
import { DateRange, DayPicker } from "react-day-picker"
import { differenceInDays, format } from "date-fns"
import { motion } from "framer-motion"

import "react-day-picker/dist/style.css"


const rooms = [
{ type:"Phòng 1 giường", price:1200000 },
{ type:"Phòng 2 giường", price:1600000 },
{ type:"Phòng VIP", price:2200000 },
{ type:"Phòng gia đình", price:2600000 }
]


export default function BookingPage(){

const [range,setRange] = useState<DateRange | undefined>()
const [guests,setGuests] = useState(2)
const [room,setRoom] = useState(rooms[0])

const [aiResult,setAiResult] = useState("")
const [loading,setLoading] = useState(false)


const nights =
range?.from && range?.to
? differenceInDays(range.to,range.from)
: 0

const total = nights * room.price


/* AI SUGGEST */

async function askAI(){

setLoading(true)

const res = await fetch("/api/ai-hotel",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
budget:total || room.price,
guests
})
})

const data = await res.json()

setAiResult(data.text)

setLoading(false)

}


/* PAYMENT */

async function handlePayment(){

if(!range?.from || !range?.to){
alert("Vui lòng chọn ngày")
return
}

try{

const res = await fetch("/api/vnpay",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
amount:total
})
})

if(!res.ok) throw new Error("Payment API error")

const data = await res.json()

if(data.url){
window.location.href = data.url
}

}catch(err){

console.error(err)
alert("Lỗi thanh toán")

}

}


return(

<main className="min-h-screen bg-[#0b0f14] text-white flex justify-center p-10">

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
className="max-w-xl w-full space-y-10"
>

<h1 className="text-3xl text-center font-semibold">
Đặt phòng khách sạn
</h1>


{/* ROOM TYPE */}

<div className="space-y-3">

<h2 className="text-lg font-semibold">
Chọn loại phòng
</h2>

<div className="grid grid-cols-2 gap-3">

{rooms.map((r)=>{

const active = r.type === room.type

return(

<button
key={r.type}
onClick={()=>setRoom(r)}
className={`border rounded-xl p-3 text-left transition
${active
? "border-emerald-400 bg-emerald-400/10"
: "border-white/10 bg-white/5 hover:border-white/30"}
`}
>

<div className="font-semibold">
{r.type}
</div>

<div className="text-sm text-zinc-400">
{r.price.toLocaleString()}đ / đêm
</div>

</button>

)

})}

</div>

</div>


{/* DATE PICKER */}

<div className="bg-white/5 p-6 rounded-2xl border border-white/10">

<DayPicker
mode="range"
selected={range}
onSelect={setRange}
/>

</div>


{/* INFO */}

<div className="space-y-3">

<div className="flex justify-between">
<span>Check-in</span>
<span>
{range?.from ? format(range.from,"dd/MM/yyyy") : "-"}
</span>
</div>

<div className="flex justify-between">
<span>Check-out</span>
<span>
{range?.to ? format(range.to,"dd/MM/yyyy") : "-"}
</span>
</div>

<div className="flex justify-between">
<span>Số khách</span>

<input
type="number"
min={1}
value={guests}
onChange={(e)=>setGuests(Number(e.target.value))}
className="w-20 bg-black/40 border border-white/10 rounded-lg px-3 py-1"
/>

</div>

<div className="flex justify-between">
<span>Số đêm</span>
<span>{nights}</span>
</div>

<div className="flex justify-between text-xl font-semibold">

<span>Tổng tiền</span>

<span className="text-emerald-400">
{total.toLocaleString()}đ
</span>

</div>

</div>


{/* AI */}

<button
onClick={askAI}
className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl"
>

{loading ? "AI đang tìm..." : " AI gợi ý khách sạn"}

</button>


{aiResult && (

<div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm whitespace-pre-line">

{aiResult}

</div>

)}


{/* PAYMENT */}

<button
onClick={handlePayment}
className="w-full bg-emerald-500 hover:bg-emerald-400 py-4 rounded-xl text-black font-semibold text-lg"
>

Thanh toán VNPay

</button>

</motion.div>

</main>

)
}