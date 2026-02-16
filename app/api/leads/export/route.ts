import clientPromise from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  const user = getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("crm");

  let leads;

  if (user.role === "admin") {
    leads = await db.collection("leads").find({}).toArray();
  } else {
    leads = await db.collection("leads")
      .find({ assignedTo: user.id })
      .toArray();
  }

  // Convert to CSV
  const headers = ["Name", "Email", "Phone", "Source", "Status"];

  const rows = leads.map((lead: any) => [
    lead.name,
    lead.email,
    lead.phone,
    lead.source,
    lead.status,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((e) => e.join(","))
      .join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=leads.csv",
    },
  });
}
