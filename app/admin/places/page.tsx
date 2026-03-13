"use client"

import { useEffect,useState } from "react"

export default function Places(){

  const [places,setPlaces] = useState([])
  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const [location,setLocation] = useState("")
  const [image,setImage] = useState("")

  const loadPlaces = async ()=>{
    const res = await fetch("/api/places")
    const data = await res.json()
    setPlaces(data)
  }

  useEffect(()=>{
    loadPlaces()
  },[])

  const addPlace = async ()=>{

    await fetch("/api/places",{
      method:"POST",
      body:JSON.stringify({
        name,
        description,
        location,
        image
      })
    })

    loadPlaces()
  }

  const deletePlace = async(id:number)=>{
    await fetch(`/api/places/${id}`,{
      method:"DELETE"
    })
    loadPlaces()
  }

  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Manage Places
      </h1>

      {/* FORM */}

      <div className="space-y-3 mb-10">

        <input
          placeholder="Place name"
          className="border p-2 w-full"
          onChange={(e)=>setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          placeholder="Location"
          className="border p-2 w-full"
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          placeholder="Image URL"
          className="border p-2 w-full"
          onChange={(e)=>setImage(e.target.value)}
        />

        <button
          onClick={addPlace}
          className="bg-black text-white px-4 py-2"
        >
          Add Place
        </button>

      </div>

      {/* LIST */}

      <div className="grid grid-cols-3 gap-6">

        {places.map((p:any)=>(

          <div key={p.id} className="bg-white p-4 rounded shadow">

            <img src={p.image} className="h-40 w-full object-cover"/>

            <h2 className="text-xl font-bold mt-2">
              {p.name}
            </h2>

            <p className="text-sm text-gray-600">
              {p.location}
            </p>

            <button
              onClick={()=>deletePlace(p.id)}
              className="text-red-500 mt-2"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  )
}