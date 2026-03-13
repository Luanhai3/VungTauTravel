"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    if (res.ok) {
      router.push("/admin/dashboard")
    } else {
      alert("Sai email hoặc password")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "white"
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          background: "#1e293b",
          padding: 40,
          borderRadius: 12,
          width: 320
        }}
      >

        <h1 style={{ marginBottom: 20 }}>
          Admin Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{ width:"100%", marginBottom:10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{ width:"100%", marginBottom:20 }}
        />

        <button
          type="submit"
          style={{
            width:"100%",
            padding:10
          }}
        >
          Login
        </button>

      </form>

    </div>
  )
}