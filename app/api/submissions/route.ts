import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["post", "reel", "video", "story"]).optional(),
  title: z.string().min(3),
  content: z.string().optional(),
  category: z.string().optional(),
  mediaUrl: z.string().optional(),
  youtubeId: z.string().optional(),
  emoji: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 },
    );
  const user = session.user as any;
  const db = await getDb();
  await db.collection("submissions").insertOne({
    ...result.data,
    status: "PENDING",
    userId: user.id,
    userName: user.name,
    userUsername: user.username,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ message: "Gönderin alındı." }, { status: 201 });
}

export async function GET() {
  try {
    const db = await getDb();
    const subs = await db
      .collection("submissions")
      .find({ status: { $nin: ["PUBLISHED", "REJECTED", "APPROVED"] } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(subs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
