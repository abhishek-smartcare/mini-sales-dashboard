import { signToken } from "@/lib/auth";
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("crm");

  const user = await db.collection("users").findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken(user);

  const response = NextResponse.json({ message: "Login success" });

  response.cookies.set("token", token, {
  httpOnly: true,
  secure: true, 
  path: "/",     
});

  return response;
}
