import { getUserFromRequest } from "@/lib/auth";
import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("crm");

  if (user.role === "admin") {
    const leads = await db.collection("leads").find().toArray();
    return NextResponse.json(leads);
  }

  const leads = await db
    .collection("leads")
    .find({ assignedTo: user.id })
    .toArray();

  return NextResponse.json(leads);
}
