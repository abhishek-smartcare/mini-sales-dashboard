import clientPromise from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: any) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  const client = await clientPromise;
  const db = client.db("crm");

  const lead = await db.collection("leads").findOne({
    _id: new ObjectId(id),
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  if (
    user.role === "sales" &&
    lead.assignedTo.toString() !== user.id.toString()
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.collection("leads").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );

  return NextResponse.json({ message: "Status updated" });
}
