import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { action, note } = await req.json();
    const db = await getDb();

    let sub: any = null;
    try {
      sub = await db
        .collection("submissions")
        .findOne({ _id: new ObjectId(params.id) });
    } catch {
      sub = await db.collection("submissions").findOne({ id: params.id });
    }
    if (!sub)
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    if (action === "approve") {
      const slug =
        (sub.title || "yazi")
          .toLowerCase()
          .replace(/[ğ]/g, "g")
          .replace(/[ü]/g, "u")
          .replace(/[ş]/g, "s")
          .replace(/[ı]/g, "i")
          .replace(/[ö]/g, "o")
          .replace(/[ç]/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 80) || "yazi";

      const post = {
        id: "p_" + Date.now(),
        slug: slug + "-" + Date.now().toString(36),
        title: sub.title,
        excerpt: sub.excerpt || (sub.content || "").slice(0, 150),
        content: sub.content || "",
        category: sub.category || "Bilim",
        tags: sub.tags || [],
        readTime: Math.max(
          1,
          Math.round((sub.content || "").split(" ").length / 200),
        ),
        coverEmoji: sub.emoji || sub.coverEmoji || "📝",
        bgGradient: "from-gray-800 to-gray-900",
        coverImage: sub.mediaUrl || null,
        youtubeId: sub.youtubeId || null,
        featured: false,
        status: "PUBLISHED",
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date().toISOString(),
        author: {
          id: sub.userId || "anon",
          name: sub.userName || "Anonim",
          username: sub.userUsername || "anon",
          avatar: "👤",
          avatarColor: "#1D9E75",
        },
      };
      await db.collection("posts").insertOne(post);
      try {
        await db
          .collection("submissions")
          .deleteOne({ _id: new ObjectId(params.id) });
      } catch {
        await db.collection("submissions").deleteOne({ id: params.id });
      }
      return NextResponse.json({ message: "Onaylandı", post });
    }

    if (action === "reject") {
      try {
        await db
          .collection("submissions")
          .deleteOne({ _id: new ObjectId(params.id) });
      } catch {
        await db.collection("submissions").deleteOne({ id: params.id });
      }
      return NextResponse.json({ message: "Reddedildi", note });
    }

    return NextResponse.json({ error: "Geçersiz aksiyon" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
