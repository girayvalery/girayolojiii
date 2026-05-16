import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Admin cookie kontrolü
    const adminCookie = req.headers.get("cookie")?.includes("admin_auth=true");
    let canDelete = false;

    if (adminCookie) {
      canDelete = true;
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user)
        return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
      const u = session.user as any;
      if (u.role === "ADMIN") canDelete = true;
    }

    if (!canDelete)
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

    const db = await getDb();
    const result = await db.collection("users").deleteOne({ id: params.id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 },
      );
    }
    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
