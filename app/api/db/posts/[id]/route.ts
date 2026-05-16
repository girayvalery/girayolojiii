import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function findPost(db: any, id: string) {
  try {
    const byObjectId = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });
    if (byObjectId) return byObjectId;
  } catch {}
  return db.collection("posts").findOne({ id });
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();
    const post = await findPost(db, params.id);
    if (!post)
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
    const u = session.user as any;
    const updates = await req.json();
    const db = await getDb();
    const post = await findPost(db, params.id);
    if (!post)
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    // Sadece sahibi veya admin düzenleyebilir
    if (post.author?.id !== u.id && u.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const allowed = [
      "title",
      "content",
      "excerpt",
      "category",
      "tags",
      "coverEmoji",
      "coverImage",
      "youtubeId",
    ];
    const filtered: any = { updatedAt: new Date().toISOString() };
    for (const k of allowed)
      if (updates[k] !== undefined) filtered[k] = updates[k];

    const filter = post._id ? { _id: post._id } : { id: post.id };
    await db.collection("posts").updateOne(filter, { $set: filtered });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Admin cookie kontrolü
    const adminCookie = req.headers.get("cookie")?.includes("admin_auth=true");
    let canDelete = false;
    let userId: string | null = null;

    if (adminCookie) {
      canDelete = true;
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user)
        return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
      const u = session.user as any;
      userId = u.id;
      if (u.role === "ADMIN") canDelete = true;
    }

    const db = await getDb();
    const post = await findPost(db, params.id);
    if (!post)
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    // Admin değilse sadece sahibi silebilir
    if (!canDelete && post.author?.id !== userId) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const filter = post._id ? { _id: post._id } : { id: post.id };
    await db.collection("posts").deleteOne(filter);
    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
