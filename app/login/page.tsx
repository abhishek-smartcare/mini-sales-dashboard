"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const  [err, setErr]= useState("")
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

if(email==="") return setErr("Please Enter Email");
if(password==="") return setErr("Please Enter password");




    if (res.ok) {
      router.replace("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
    
    {err? <div className="text-center mt-4 text-red-600">{err}</div>:""}

    <div className="flex justify-between gap-6">

    <div className="grid  p-10 max-w-sm mx-auto w-1/3">
      <h1 className="text-xl font-bold text-center">Login</h1>
      <input
        className="border-3 rounded-[5px] mb-[12px] text-base p-[12px]"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        className="border-3 rounded-[5px] mb-[12px] text-base p-[12px]"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-black hover:bg-gray-700 text-white border-3 rounded-lg text-base p-3"
      >
        Login
      </button>
     

    </div>
    </div>
    </>
  );
}
