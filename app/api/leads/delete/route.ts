import clientPromise from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: any) {
  const user = getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db("crm");

  await db.collection("leads").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted successfully" });
}
