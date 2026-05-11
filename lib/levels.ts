// Level / Quest sistemi

export type Quest = {
  level: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition:
    | "register"
    | "readPosts"
    | "reactions"
    | "comments"
    | "following"
    | "posts"
    | "followers"
    | "totalViews"
    | "commentsReceived";
  target: number;
};

export const QUESTS: Quest[] = [
  {
    level: 1,
    title: "Hoş Geldin",
    description: "Aramıza katıldın",
    icon: "🌱",
    color: "#1D9E75",
    condition: "register",
    target: 1,
  },
  {
    level: 2,
    title: "Meraklı",
    description: "İlk yazını oku",
    icon: "📖",
    color: "#1D9E75",
    condition: "readPosts",
    target: 1,
  },
  {
    level: 3,
    title: "İlk Tepki",
    description: "Bir yazıya tepki ver",
    icon: "💡",
    color: "#1AAE9F",
    condition: "reactions",
    target: 1,
  },
  {
    level: 4,
    title: "Sessizliği Boz",
    description: "İlk yorumunu yaz",
    icon: "💬",
    color: "#185fa5",
    condition: "comments",
    target: 1,
  },
  {
    level: 5,
    title: "Sosyal",
    description: "Birini takip et",
    icon: "🤝",
    color: "#534AB7",
    condition: "following",
    target: 1,
  },
  {
    level: 6,
    title: "İlk Yazar",
    description: "İlk yazını yayınla",
    icon: "✍️",
    color: "#ba7517",
    condition: "posts",
    target: 1,
  },
  {
    level: 7,
    title: "Okur",
    description: "5 yazı oku",
    icon: "📚",
    color: "#185fa5",
    condition: "readPosts",
    target: 5,
  },
  {
    level: 8,
    title: "Tepkisever",
    description: "10 tepki ver",
    icon: "🔥",
    color: "#D85A30",
    condition: "reactions",
    target: 10,
  },
  {
    level: 9,
    title: "Üretken",
    description: "3 yazı yayınla",
    icon: "📝",
    color: "#1D9E75",
    condition: "posts",
    target: 3,
  },
  {
    level: 10,
    title: "Tanınan",
    description: "10 takipçi kazan",
    icon: "⭐",
    color: "#ba7517",
    condition: "followers",
    target: 10,
  },
  {
    level: 11,
    title: "Aktif",
    description: "50 tepki ver",
    icon: "⚡",
    color: "#D85A30",
    condition: "reactions",
    target: 50,
  },
  {
    level: 12,
    title: "Konuşkan",
    description: "25 yorum yap",
    icon: "🗣️",
    color: "#185fa5",
    condition: "comments",
    target: 25,
  },
  {
    level: 13,
    title: "Atılgan Yazar",
    description: "5 yazı yayınla",
    icon: "📜",
    color: "#0F6E56",
    condition: "posts",
    target: 5,
  },
  {
    level: 14,
    title: "Popüler",
    description: "50 takipçi",
    icon: "🌟",
    color: "#ba7517",
    condition: "followers",
    target: 50,
  },
  {
    level: 15,
    title: "Görünür",
    description: "500 toplam görüntülenme",
    icon: "👁️",
    color: "#534AB7",
    condition: "totalViews",
    target: 500,
  },
  {
    level: 16,
    title: "Tartışmacı",
    description: "25 yorum al",
    icon: "💭",
    color: "#D4537E",
    condition: "commentsReceived",
    target: 25,
  },
  {
    level: 17,
    title: "Topluluk Yıldızı",
    description: "100 takipçi",
    icon: "🏆",
    color: "#ba7517",
    condition: "followers",
    target: 100,
  },
  {
    level: 18,
    title: "Viral",
    description: "1000 toplam görüntülenme",
    icon: "🌊",
    color: "#D4537E",
    condition: "totalViews",
    target: 1000,
  },
  {
    level: 19,
    title: "Etkileyici",
    description: "50 yorum al",
    icon: "💬",
    color: "#534AB7",
    condition: "commentsReceived",
    target: 50,
  },
  {
    level: 20,
    title: "Efsane",
    description: "100 yazı + 1000 takipçi",
    icon: "👑",
    color: "#D4AC2A",
    condition: "followers",
    target: 1000,
  },
];

export type UserStats = {
  register: number;
  readPosts: number;
};

export function calculateLevel(stats: UserStats): {
  level: number;
  current: Quest;
  next: Quest | null;
  progress: number;
} {
  let level = 0;
  for (const q of QUESTS) {
    if ((stats as any)[q.condition] >= q.target) level = q.level;
    else break;
  }
  const current = QUESTS[level - 1] || QUESTS[0];
  const next = QUESTS[level] || null;
  const progress = next
    ? Math.min(100, ((stats as any)[next.condition] / next.target) * 100)
    : 100;
  return { level, current, next, progress };
}
