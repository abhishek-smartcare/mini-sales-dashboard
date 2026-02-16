import clientPromise from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: any) {
  const user = getUserFromRequest(req);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, email, phone, source, assignedTo } = await req.json();

  const client = await clientPromise;
  const db = client.db("crm");

  const existingLead = await db.collection("leads").findOne({
    $or: [{ email }, { phone }],
  });

  if (existingLead) {
    alert("user already available");
    return NextResponse.json(
      { error: "Lead already exists with this Email or Phone" },
      { status: 409 }   
    );
  }

  await db.collection("leads").insertOne({
    name,
    email,
    phone,
    source,
    assignedTo: new ObjectId(assignedTo),
    status: "New",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ message: "Lead created" });
}
