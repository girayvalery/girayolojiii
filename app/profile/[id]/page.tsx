"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type User } from "@/lib/data";
import { type Quest } from "@/lib/levels";
import { type AvatarConfig, DEFAULT_AVATAR } from "@/lib/avatar";
import ActivityMap from "@/components/profile/ActivityMap";
import ProfileTabs from "@/components/profile/ProfileTabs";
import EditProfileModal from "@/components/modals/EditProfileModal";
import AvatarBuilder from "@/components/profile/AvatarBuilder";
import FollowButton from "@/components/profile/FollowButton";
import FollowList from "@/components/profile/FollowList";
import LevelCard from "@/components/profile/LevelCard";
import UserAvatar from "@/components/avatar/UserAvatar";
import { useToast } from "@/components/ui/Toast";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: session, update } = useSession();
  const sessionUser = session?.user as any;
  const isOwnProfile = sessionUser?.id === params.id;
  const { show } = useToast();

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [level, setLevel] = useState(0);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [nextQuest, setNextQuest] = useState<Quest | null>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<any>({});
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);
  const [showFollowList, setShowFollowList] = useState<
    "followers" | "following" | null
  >(null);

  const load = useCallback(async () => {
    try {
      const usersRes = await fetch("/api/db/users", { cache: "no-store" }).then(
        (r) => r.json(),
      );
      const u = Array.isArray(usersRes)
        ? usersRes.find((x: any) => x.id === params.id)
        : null;

      if (u) {
        setUser({
          id: u.id,
          name: u.name,
          username: u.username,
          email: u.email,
          avatar: u.avatar || "🧑‍🚀",
          avatarColor: u.avatarColor || "#1D9E75",
          avatarConfig: u.avatarConfig,
          bio: u.bio || "",
          role: u.role || "UYE",
          joinedAt: u.joinedAt || new Date().toISOString(),
          photoUrl: u.photoUrl,
        });
      } else if (isOwnProfile && sessionUser) {
        setUser({
          id: sessionUser.id || params.id,
          name: sessionUser.name || "Kullanıcı",
          username: sessionUser.username || params.id,
          email: sessionUser.email || "",
          avatar: sessionUser.avatar || "🧑‍🚀",
          avatarColor: sessionUser.avatarColor || "#1D9E75",
          avatarConfig: sessionUser.avatarConfig,
          bio: sessionUser.bio || "",
          role: sessionUser.role || "UYE",
          joinedAt: new Date().toISOString(),
          photoUrl: sessionUser.photoUrl,
        });
      }

      const postsRes = await fetch("/api/db/posts", { cache: "no-store" }).then(
        (r) => r.json(),
      );
      const myPosts = Array.isArray(postsRes)
        ? postsRes.filter((p: any) => p.author?.id === params.id)
        : [];
      setPosts(myPosts);

      const ach = await fetch(`/api/achievements?userId=${params.id}`, {
        cache: "no-store",
      }).then((r) => r.json());
      setLevel(ach.level || 0);
      setCurrentQuest(ach.current || null);
      setNextQuest(ach.next || null);
      setProgress(ach.progress || 0);
      setStats(ach.stats || {});
      setCompletedQuests(ach.completedQuests || []);
      setAllQuests(ach.allQuests || []);

      try {
        const actRes = await fetch(`/api/activity?userId=${params.id}`, {
          cache: "no-store",
        }).then((r) => r.json());
        setActivity(actRes.days || []);
      } catch {
        setActivity([]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [params.id, isOwnProfile, sessionUser]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user)
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--text)" }}
        >
          Kullanıcı bulunamadı
        </h1>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: "#1D9E75" }}
        >
          Ana Sayfa
        </Link>
      </div>
    );

  const isNewUser = posts.length === 0 && level <= 1;

  async function handleSave(updates: any) {
    setUser((prev: any) => (prev ? { ...prev, ...updates } : null));
    setEditOpen(false);
    show("success", "Profilin güncellendi");
    setTimeout(() => load(), 500);
  }

  async function saveAvatarConfig(cfg: AvatarConfig) {
    try {
      const res = await fetch("/api/db/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarConfig: cfg, photoUrl: "" }),
      });
      if (res.ok) {
        show("success", "🎨 Karakter kaydedildi! Sayfa yenileniyor...");
        // 500ms sonra sayfayı zorla yenile — session ve cache temizlensin
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        show("error", "Kaydedilemedi");
      }
    } catch (e) {
      show("error", "Kaydedilemedi");
    }
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <aside>
            <div
              className="rounded-2xl p-6 lg:sticky lg:top-20"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex justify-center mb-4">
                <UserAvatar user={user} size={120} />
              </div>

              {user.role === "ADMIN" && (
                <div className="flex justify-center mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "#1D9E75", color: "#fff" }}
                  >
                    Admin
                  </span>
                </div>
              )}

              <h1
                className="text-xl font-semibold text-center mb-0.5"
                style={{ color: "var(--text)" }}
              >
                {user.name}
              </h1>
              <p
                className="text-sm text-center mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                @{user.username}
              </p>

              {currentQuest && (
                <div
                  className="flex items-center justify-center gap-2 mb-3 px-3 py-1.5 rounded-full"
                  style={{
                    background: `${currentQuest.color}15`,
                    border: `1px solid ${currentQuest.color}40`,
                  }}
                >
                  <span className="text-base">{currentQuest.icon}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: currentQuest.color }}
                  >
                    Lv {level} · {currentQuest.title}
                  </span>
                </div>
              )}

              {user.bio && (
                <p
                  className="text-sm text-center leading-relaxed mb-4"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {user.bio}
                </p>
              )}

              <div
                className="grid grid-cols-3 gap-2 mb-4 py-3 rounded-xl"
                style={{ background: "var(--bg-subtle)" }}
              >
                <div className="text-center">
                  <div
                    className="text-base font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {stats.posts || 0}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Yazı
                  </div>
                </div>
                <button
                  onClick={() => setShowFollowList("followers")}
                  className="text-center cursor-pointer hover:opacity-80"
                >
                  <div
                    className="text-base font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {stats.followers || 0}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Takipçi
                  </div>
                </button>
                <button
                  onClick={() => setShowFollowList("following")}
                  className="text-center cursor-pointer hover:opacity-80"
                >
                  <div
                    className="text-base font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {stats.following || 0}
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Takip
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setEditOpen(true)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "#1D9E75" }}
                    >
                      ✏️ Profili Düzenle
                    </button>
                    <button
                      onClick={() => setShowAvatarBuilder((p) => !p)}
                      className="w-full py-2 rounded-xl text-sm font-medium border"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      🎨 Karakter Tasarla
                    </button>
                    <Link
                      href="/ayarlar"
                      className="block w-full py-2 rounded-xl text-sm font-medium border text-center"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      ⚙️ Ayarlar
                    </Link>
                  </>
                ) : (
                  <FollowButton
                    targetId={user.id}
                    isOwn={isOwnProfile}
                    onChange={load}
                  />
                )}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {isOwnProfile && isNewUser && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(29,158,117,0.15), rgba(15,110,86,0.1))",
                  border: "1px solid rgba(29,158,117,0.3)",
                }}
              >
                <div className="text-4xl mb-2">👋</div>
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  Hoş geldin, {user.name}!
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  Profilini tamamlayıp Girayoloji'de iz bırakmaya başla.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowAvatarBuilder(true)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "#1D9E75" }}
                  >
                    🎨 Karakter Tasarla
                  </button>
                  <button
                    onClick={() => setEditOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    ✏️ Profili Düzenle
                  </button>
                  <Link
                    href="/katkida-bulun"
                    className="px-4 py-2 rounded-xl text-sm font-semibold border"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    ✍️ İçerik Ekle
                  </Link>
                </div>
              </div>
            )}

            {showAvatarBuilder && isOwnProfile && (
              <AvatarBuilder
                initial={user.avatarConfig || DEFAULT_AVATAR}
                onSave={saveAvatarConfig}
                onCancel={() => setShowAvatarBuilder(false)}
              />
            )}

            <LevelCard
              level={level}
              currentQuest={currentQuest}
              nextQuest={nextQuest}
              progress={progress}
              stats={stats}
              completedQuests={completedQuests}
              allQuests={allQuests}
              isOwn={isOwnProfile}
            />

            <ActivityMap data={activity} />

            <ProfileTabs posts={posts} />
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}
      {showFollowList && (
        <FollowList
          userId={user.id}
          type={showFollowList}
          onClose={() => setShowFollowList(null)}
        />
      )}
    </>
  );
}
