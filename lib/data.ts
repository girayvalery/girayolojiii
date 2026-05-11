// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

export type Role = 'ADMIN' | 'YAZAR' | 'UYE'

export type User = {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  avatarColor: string
  bio: string
  role: Role
  postCount: number
  followerCount: number
  joinedAt: string
  photoUrl?: string
  avatarPattern?: string
}

export type Story = {
  id: string
  userId: string
  user: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'avatarColor'>
  emoji: string
  title: string
  imageUrl?: string
  seen: boolean
  createdAt: string
}

export type Reel = {
  id: string
  slug: string
  title: string
  description: string
  emoji: string
  bgGradient: string
  duration: string
  views: number
  likes: number
  category: string
  videoUrl?: string
  author: Pick<User, 'id' | 'name' | 'avatar' | 'avatarColor'>
  publishedAt: string
}

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readTime: number
  coverEmoji: string
  bgGradient: string
  featured: boolean
  status: 'PUBLISHED' | 'PENDING' | 'REJECTED' | 'DRAFT'
  viewCount: number
  likeCount: number
  publishedAt: string
  coverImage?: string
  youtubeId?: string
  author: Pick<User, 'id' | 'name' | 'username' | 'avatar' | 'avatarColor'>
}

export type Video = {
  id: string
  slug: string
  title: string
  description: string
  duration: string
  category: string
  isShort: boolean
  emoji: string
  bgGradient: string
  views: number
  publishedAt: string
  youtubeId?: string
  author: Pick<User, 'id' | 'name' | 'avatar' | 'avatarColor'>
}

export type Category = {
  name: string
  emoji: string
  count: number
  color: string
  textColor: string
}

export type Comment = {
  id: string
  postId: string
  parentId: string | null
  content: string
  author: Pick<User, 'id' | 'name' | 'avatar' | 'avatarColor'>
  upvotes: number
  downvotes: number
  createdAt: string
  replies?: Comment[]
}

export type Reaction = '💡' | '🔥' | '❤️' | '👏' | '🤯'

export type Badge = {
  id: string
  icon: string
  label: string
  description: string
  color: string
}

// ═══════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════

export const USERS: User[] = [
  { id: 'u1', name: 'Giray', username: 'giray', email: 'giray@girayoloji.com', avatar: '🧑‍🚀', avatarColor: '#1D9E75', bio: 'Bilim, dilbilim ve tarih kesişiminde içerik üretiyor. YouTube: @Girayoloji', role: 'ADMIN', postCount: 6, followerCount: 320, joinedAt: '2025-11-01' },
]

// ═══════════════════════════════════════════════════════
// STORIES (Giray'ın hikayeleri)
// ═══════════════════════════════════════════════════════

export const STORIES: Story[] = [
  { id: 'st1', userId: 'u1', user: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }, emoji: '🗣️', title: 'Türkçenin Sırrı', seen: false, createdAt: '2026-04-21T08:00:00Z' },
  { id: 'st2', userId: 'u1', user: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }, emoji: '🩺', title: 'Tıp Tarihi', seen: false, createdAt: '2026-04-21T09:00:00Z' },
  { id: 'st3', userId: 'u1', user: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }, emoji: '🎉', title: 'Yılbaşının Kökeni', seen: false, createdAt: '2026-04-21T10:00:00Z' },
]

// ═══════════════════════════════════════════════════════
// REELS — Boş başlıyoruz (Giray ekleyecek)
// ═══════════════════════════════════════════════════════

export const REELS: Reel[] = []

// ═══════════════════════════════════════════════════════
// VIDEOS — Giray'ın 3 YouTube videosu
// ═══════════════════════════════════════════════════════

export const VIDEOS: Video[] = [
  {
    id: 'v1', slug: 'turkcenin-en-uzun-kelimesi',
    title: 'Türkçenin En Uzun Kelimesi!',
    description: 'Türkçenin 70 harfli rekortmen kelimesi nedir, ne anlama gelir? Türkçenin sondan eklemeli yapısının nasıl bu kadar uzun kelimeler türetebildiğini ve dünyanın diğer dillerindeki en uzun kelimeleri inceledim.',
    duration: '8:42', category: 'Dilbilim', isShort: false,
    emoji: '🗣️', bgGradient: 'from-orange-950 to-amber-900',
    views: 1240, publishedAt: '2025-11-17', youtubeId: 'bUTHekiQAYI',
    author: { id: 'u1', name: 'Giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'v2', slug: 'neden-1-ocak-yilbasi',
    title: '1 Ocak Neden Yılbaşı? Tanrılar Değil, Devlet Karar Verdi',
    description: 'Yeni yıl gerçekten yeni mi? Gökyüzü değişmedi, Güneş aynı yörüngede. Peki neden 1 Ocak\'ı yılbaşı kabul ediyoruz? Jül Sezar\'dan Roma tanrısı Janus\'a; yılbaşının tarihsel yolculuğu.',
    duration: '11:24', category: 'Tarih', isShort: false,
    emoji: '🎉', bgGradient: 'from-purple-950 to-indigo-900',
    views: 980, publishedAt: '2025-12-27', youtubeId: 'z-GDjRXRc1E',
    author: { id: 'u1', name: 'Giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'v3', slug: 'myrtle-corbin-dort-bacakli-kadin',
    title: 'Myrtle Corbin: 4 Bacaklı Kadının İnanılmaz Hikayesi',
    description: 'Tarihin en sıra dışı insanlarından Myrtle Corbin, dipygus adı verilen nadir bir doğum anomalisi ile dünyaya geldi: 4 bacak ve 2 pelvis. Sirklerde gösterildi, evlendi, çocukları oldu.',
    duration: '9:18', category: 'Tıp', isShort: false,
    emoji: '🩺', bgGradient: 'from-pink-950 to-rose-900',
    views: 1560, publishedAt: '2026-01-15', youtubeId: '0GqMOqUMNhU',
    author: { id: 'u1', name: 'Giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
]

// ═══════════════════════════════════════════════════════
// POSTS — Giray'ın blog yazıları (videolarla bağlantılı)
// ═══════════════════════════════════════════════════════

export const POSTS: Post[] = [
  {
    id: 'p1', slug: 'turkcenin-en-uzun-kelimesi',
    title: 'Türkçenin En Uzun Kelimesi: 70 Harflik Mucize',
    excerpt: '"Muvaffakiyetsizleştiricileştiriveremeyebileceklerimizdenmişsinizcesine" — TDK\'nın bile kabul ettiği bu 70 harfli dev kelimeyi parçalayıp anlamını çözüyoruz.',
    content: 'Türkçe, kelime köklerine ekler ekleyerek sınırsız üretim yapabilen bir dil. İşte bu özelliği sayesinde, dilimizin en uzun kelimesi olarak kabul edilen 70 harflik bir canavar ortaya çıkmış: muvaffakiyetsizleştiricileştiriveremeyebileceklerimizdenmişsinizcesine.\n\n## Kelimeyi Parçalayalım\n\nKökü "muvaffakiyet" yani başarı. Ardından gelen her ek kelimeye yeni bir anlam katmanı ekliyor: -siz (olumsuzluk), -leş (dönüşüm), -tir (ettirgenlik), -ici (sıfat), -leş (tekrar dönüşüm), -tir (ettirgenlik), -iver (tezlik), -e (yeterlilik), -me (olumsuzluk), -y-e-bil-ecek-ler-imiz-den-miş-siniz-cesine.\n\n## Anlam Ne?\n\n"Hemencecik başarısızlaştırıcı hâline getiremeyebileceğimiz kişilerden biriymişsiniz gibi". Tek kelimede koca bir cümle.\n\n## Diğer Diller Ne Diyor?\n\nAlmancanın ünlü "Donaudampfschiffahrtsgesellschaftskapitän" 42 harf. Felemenkçenin "Kindercarnavalsoptochtvoorbereidingswerkzaamheden" 49 harf. İngilizcenin tıbbi terimi "pneumonoultramicroscopicsilicovolcanoconiosis" 45 harf.\n\nTürkçe yine birinci. Sondan eklemeli yapımızın gücü işte burada.',
    category: 'Dilbilim', tags: ['türkçe','dilbilim','kelime'],
    readTime: 5, coverEmoji: '🗣️', bgGradient: 'from-orange-950 to-amber-900',
    featured: true, status: 'PUBLISHED', viewCount: 1240, likeCount: 87,
    publishedAt: '2025-11-17', youtubeId: 'bUTHekiQAYI',
    author: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'p2', slug: 'neden-1-ocak-yilbasi',
    title: '1 Ocak Neden Yılbaşı? Astronomik Değil, Politik',
    excerpt: 'Gökyüzünde hiçbir şey değişmiyor. O halde neden tam da 1 Ocak\'ı yeni yıl başlangıcı sayıyoruz? Cevap, Jül Sezar\'da gizli.',
    content: 'Yeni yıla giriyoruz deniyor. Peki gerçekten "yeni" olan ne? Gökyüzü değişmedi. Güneş aynı yörüngede, Dünya aynı hızda dönüyor. Evrende herhangi bir eşik aşılmıyor.\n\n## Janus: İki Yüzlü Tanrı\n\nOcak ayının adı, Roma\'nın başlangıçlar tanrısı Janus\'tan geliyor. İki yüzlü bu tanrının bir yüzü geçmişe, diğeri geleceğe bakar. Romalılar, yıla onun adıyla başlayarak hem geride bıraktıklarını hem de gelecek olanı kutsuyordu.\n\n## Jül Sezar Devreye Giriyor\n\nMÖ 46 yılında Jül Sezar, Mısırlı astronomlardan etkilenerek Jülyen takvimini benimsedi ve yılbaşını resmi olarak 1 Ocak\'a sabitledi. Yani 1 Ocak\'ın yılbaşı olması bir doğa olayı değil, devlet kararıydı.\n\n## Babiller, Mısırlılar, Mayalar\n\nFarklı medeniyetler farklı tarihlerde kutladı: Babiller ilkbahar ekinoksunda (Akitu Bayramı), Mısırlılar Nil\'in taşmasıyla (Temmuz), Mayalar yine Temmuz\'da.\n\n## Adetler ve Örfler\n\nÇam ağacı süslemek aslında pagan bir Cermen geleneği. Hediye vermek Roma\'nın Saturnalia bayramından kaldı. Havai fişek Çin kökenli. Bugün yaptığımız her şey, binlerce yıllık katmanların birikimi.',
    category: 'Tarih', tags: ['tarih','kültür','takvim'],
    readTime: 6, coverEmoji: '🎉', bgGradient: 'from-purple-950 to-indigo-900',
    featured: true, status: 'PUBLISHED', viewCount: 980, likeCount: 64,
    publishedAt: '2025-12-27', youtubeId: 'z-GDjRXRc1E',
    author: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'p3', slug: 'myrtle-corbin-4-bacakli-kadin',
    title: 'Myrtle Corbin: 4 Bacaklı Kadının Sıra Dışı Hayatı',
    excerpt: 'Dipygus adı verilen nadir bir gelişim anomalisiyle dünyaya gelen Myrtle Corbin, sirklerde gösterildi, evlendi, beş çocuk büyüttü.',
    content: 'Myrtle Corbin, 1868\'de Tennessee\'de dünyaya geldi. Doğum anında ebenin gözlerine inanamadığı şey: bebeğin 4 bacağı vardı.\n\n## Dipygus Nedir?\n\nDipygus, embriyonun gelişiminin erken evresinde bir ikiz oluşumunun tamamlanamadığı nadir bir durum. Sonuç: tek bir vücut, ama iki pelvis ve dört bacak. Myrtle\'nin iç bacakları daha küçük ve zayıftı, yürümek için yalnızca dış bacaklarını kullanıyordu.\n\n## Sirk Yıllarına\n\nO dönemde "olağan dışı" insanların gösterildiği "freak show"\'lar popülerdi. Myrtle, 13 yaşında P.T. Barnum\'un programına katıldı ve "The Four-Legged Girl from Texas" olarak ünlendi. Haftada 450 dolar kazanıyordu — o dönem için servet.\n\n## Aşk ve Annelik\n\n19 yaşında Dr. Clinton Bicknell ile evlendi. Beş çocuk doğurdu — üçü sağ kaldı.\n\n## Kapanış\n\n1928\'de 60 yaşında öldü. Mezarı, ölümünden sonra mezar soyguncularına karşı koruma altına alındı.',
    category: 'Tıp', tags: ['tıp','tarih','biyoloji'],
    readTime: 6, coverEmoji: '🩺', bgGradient: 'from-pink-950 to-rose-900',
    featured: true, status: 'PUBLISHED', viewCount: 1560, likeCount: 112,
    publishedAt: '2026-01-15', youtubeId: '0GqMOqUMNhU',
    author: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'p4', slug: 'sondan-eklemeli-diller',
    title: 'Sondan Eklemeli Diller: Türkçenin Süper Gücü',
    excerpt: 'Türkçe, Macarca, Fince, Japonca... Hepsi sondan eklemeli. Peki bu dilleri bu kadar üretken yapan ne?',
    content: 'Dünya dilleri kabaca üç gruba ayrılır: yalın (İngilizce gibi), bükünlü (Arapça gibi) ve sondan eklemeli (Türkçe gibi).\n\n## Sondan Eklemeli Ne Demek?\n\nKelimenin köküne sırasıyla ekler eklenir, her ek kendi anlamını korur. "Ev-ler-im-de-ki-ler-den" — beş ek, beş anlam katmanı.\n\n## Avantajları\n\nMatematiksel düzen sayesinde yapay zeka modelleri Türkçeyi öğrenmekte zorlanmaz. Eklerin sırası bellidir, kuralları net.\n\n## Dezavantajları\n\nKelimeler uzayabilir.',
    category: 'Dilbilim', tags: ['türkçe','dilbilim'],
    readTime: 4, coverEmoji: '📝', bgGradient: 'from-amber-950 to-orange-900',
    featured: false, status: 'PUBLISHED', viewCount: 540, likeCount: 38,
    publishedAt: '2025-11-20',
    author: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'p5', slug: 'takvim-tarihi',
    title: 'Takvim Nasıl İcat Edildi?',
    excerpt: 'Sümerlerden Mısırlılara, Mayalardan Romalılara — insanlık zamanı nasıl kayda geçirdi?',
    content: 'Takvim, insanlığın en eski icatlarından biri. Mevsimlerin döngüsünü takip etmek hayatta kalmak için zorunluydu.\n\n## İlk Takvimler\n\nSümerler MÖ 3000\'lerde Ay\'ın evrelerine göre takvim yaptı.\n\n## Mısırlılar Devreye Girer\n\nNil\'in taşmasını öngörebilmek için Sirius yıldızının doğuşunu izlediler. Sonuç: 365 günlük güneş takvimi.\n\n## Jülyen ve Gregoryen\n\nJül Sezar MÖ 46\'da Mısır modelini Roma\'ya taşıdı. 1582\'de Papa XIII. Gregory küçük hatayı düzeltti.',
    category: 'Tarih', tags: ['tarih','takvim'],
    readTime: 5, coverEmoji: '📅', bgGradient: 'from-indigo-950 to-purple-900',
    featured: false, status: 'PUBLISHED', viewCount: 720, likeCount: 52,
    publishedAt: '2025-12-30',
    author: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
  {
    id: 'p6', slug: 'tibbi-anomaliler',
    title: 'Tarihteki Sıra Dışı Tıbbi Vakalar',
    excerpt: 'Myrtle Corbin\'den Joseph Merrick\'e — tıp tarihine ışık tutan beden hikayeleri.',
    content: 'Bazı insanların hikayeleri tıp kitaplarından değil, tıp kitaplarına yazıldı.\n\n## Myrtle Corbin\n\n4 bacaklı kadın. Dipygus.\n\n## Joseph Merrick\n\n"Fil Adam" olarak bilinen Joseph Merrick.\n\n## Phineas Gage\n\n1848\'de demir bir çubuk kafatasını delip geçti. Hayatta kaldı, ama kişiliği değişti.\n\n## Henrietta Lacks\n\n1951\'de servikal kanserden öldü. Onun rızası alınmadan alınan hücreleri (HeLa) hâlâ kullanılıyor.',
    category: 'Tıp', tags: ['tıp','tarih','anatomi'],
    readTime: 7, coverEmoji: '⚕️', bgGradient: 'from-rose-950 to-pink-900',
    featured: false, status: 'PUBLISHED', viewCount: 890, likeCount: 71,
    publishedAt: '2026-02-01',
    author: { id: 'u1', name: 'Giray', username: 'giray', avatar: '🧑‍🚀', avatarColor: '#1D9E75' }
  },
]

// ═══════════════════════════════════════════════════════
// CATEGORIES & TAGS
// ═══════════════════════════════════════════════════════

export const CATEGORIES: Category[] = [
  { name: 'Dilbilim', emoji: '🗣️', count: 2, color: 'rgba(186,117,23,0.12)', textColor: '#ba7517' },
  { name: 'Tarih', emoji: '📜', count: 2, color: 'rgba(83,74,183,0.12)', textColor: '#7F77DD' },
  { name: 'Tıp', emoji: '🩺', count: 2, color: 'rgba(212,83,126,0.12)', textColor: '#D4537E' },
  { name: 'Bilim', emoji: '🔬', count: 0, color: 'rgba(29,158,117,0.12)', textColor: '#1D9E75' },
  { name: 'Felsefe', emoji: '💡', count: 0, color: 'rgba(83,74,183,0.12)', textColor: '#7F77DD' },
  { name: 'Teknoloji', emoji: '🤖', count: 0, color: 'rgba(24,95,165,0.12)', textColor: '#185fa5' },
  { name: 'Astronomi', emoji: '🌌', count: 0, color: 'rgba(68,68,65,0.12)', textColor: '#888780' },
  { name: 'Biyoloji', emoji: '🧬', count: 0, color: 'rgba(29,158,117,0.12)', textColor: '#1D9E75' },
]

export const TAGS = ['türkçe', 'dilbilim', 'tarih', 'tıp', 'bilim', 'kelime', 'kültür', 'takvim', 'biyoloji', 'anatomi']

// ═══════════════════════════════════════════════════════
// COMMENTS — boş başlangıç
// ═══════════════════════════════════════════════════════

export const COMMENTS: Comment[] = []

// ═══════════════════════════════════════════════════════
// REACTIONS & BADGES
// ═══════════════════════════════════════════════════════

export const REACTIONS: { emoji: Reaction; label: string }[] = [
  { emoji: '💡', label: 'İlham Aldım' },
  { emoji: '🔥', label: 'Harika' },
  { emoji: '❤️', label: 'Sevdim' },
  { emoji: '👏', label: 'Tebrikler' },
  { emoji: '🤯', label: 'İnanılmaz' },
]

export const ALL_BADGES: Badge[] = [
  { id: 'pioneer', icon: '🚀', label: 'Öncü', description: 'İlk üye', color: '#534AB7' },
  { id: 'writer', icon: '✍️', label: 'Yazar', description: '5+ makale', color: '#1D9E75' },
  { id: 'explorer', icon: '🔭', label: 'Kaşif', description: '20+ kategori', color: '#185fa5' },
  { id: 'curator', icon: '📚', label: 'Küratör', description: '50+ kayıt', color: '#ba7517' },
  { id: 'thinker', icon: '🧠', label: 'Düşünür', description: '100+ yorum', color: '#D4537E' },
  { id: 'viral', icon: '🌊', label: 'Viral', description: '1000+ görüntülenme', color: '#D85A30' },
]

export const USER_BADGES: Record<string, string[]> = {
  u1: ['pioneer', 'writer', 'viral'],
}

export const PINNED_POSTS: Record<string, string[]> = {
  u1: ['p1', 'p2', 'p3'],
}

// ═══════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════

export const getAllPosts = () => POSTS
export const getPublished = () => POSTS.filter(p => p.status === 'PUBLISHED')
export const getPending = () => POSTS.filter(p => p.status === 'PENDING')
export const getFeatured = () => POSTS.filter(p => p.featured && p.status === 'PUBLISHED')
export const getPostBySlug = (slug: string) => POSTS.find(p => p.slug === slug) ?? null
export const getRelated = (post: Post, n = 2) => POSTS.filter(p => p.id !== post.id && p.category === post.category && p.status === 'PUBLISHED').slice(0, n)
export const getRecent = (n = 5) => getPublished().slice(0, n)

export const getRecommended = (post: Post, n = 6): Post[] => {
  const same = POSTS.filter(p => p.id !== post.id && p.category === post.category && p.status === 'PUBLISHED')
  const diff = POSTS.filter(p => p.id !== post.id && p.category !== post.category && p.status === 'PUBLISHED')
  return [...same, ...diff].slice(0, n)
}

export const getAllVideos = () => VIDEOS
export const getAllReels = () => REELS
export const getVideoBySlug = (slug: string) => VIDEOS.find(v => v.slug === slug) ?? null
export const getAllStories = () => STORIES
export const getAllUsers = () => USERS
export const getUserById = (id: string) => USERS.find(u => u.id === id) ?? null
export const getUserByUsername = (username: string) => USERS.find(u => u.username === username) ?? null

export const getCommentsByPost = (postId: string): Comment[] => {
  const flat = COMMENTS.filter(c => c.postId === postId)
  const roots = flat.filter(c => !c.parentId)
  function attach(node: Comment): Comment {
    return { ...node, replies: flat.filter(c => c.parentId === node.id).map(attach) }
  }
  return roots.map(attach)
}

export const getUserBadges = (userId: string): Badge[] => {
  const ids = USER_BADGES[userId] || []
  return ALL_BADGES.filter(b => ids.includes(b.id))
}

export const getPinnedPosts = (userId: string): Post[] => {
  const ids = PINNED_POSTS[userId] || []
  return ids.map(id => POSTS.find(p => p.id === id)).filter(Boolean) as Post[]
}

export const getUserPosts = (userId: string): Post[] =>
  POSTS.filter(p => p.author.id === userId && p.status === 'PUBLISHED')

export const searchAll = (q: string) => {
  const lq = q.toLowerCase()
  return {
    posts: POSTS.filter(p => p.status === 'PUBLISHED' && (p.title.toLowerCase().includes(lq) || p.excerpt.toLowerCase().includes(lq))),
    videos: VIDEOS.filter(v => v.title.toLowerCase().includes(lq)),
    users: USERS.filter(u => u.name.toLowerCase().includes(lq) || u.username.toLowerCase().includes(lq)),
  }
}

export function generateActivityMap(userId: string, isNew = false): number[] {
  // Yeni üyeler için sıfır harita
  if (isNew) return Array(364).fill(0)
  const seed = userId.charCodeAt(0) + (userId.charCodeAt(1) || 0)
  return Array.from({ length: 364 }, (_, i) => {
    const r = Math.sin(seed * i * 0.1) * 0.5 + 0.5
    if (r > 0.85) return 4
    if (r > 0.7) return 3
    if (r > 0.55) return 2
    if (r > 0.4) return 1
    return 0
  })
}
