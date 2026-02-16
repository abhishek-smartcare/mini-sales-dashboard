import clientPromise from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  const user = getUserFromRequest(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const client = await clientPromise;
  const db = client.db("crm");

  const salesUsers = await db
    .collection("users")
    .find({ role: "sales" })
    .toArray();

  return NextResponse.json(
    salesUsers.map((u) => ({
      id: u._id,
      email: u.email,
    }))
  );
}
