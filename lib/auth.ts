import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getDb } from './mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        password: { label: 'Sifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const db = await getDb()
          const user = await db.collection('users').findOne({ email: credentials.email })
          if (!user || !user.password) return null
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
            avatarColor: user.avatarColor,
            photoUrl: user.photoUrl,
          } as any
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as any
        token.id = u.id
        token.username = u.username
        token.role = u.role || 'UYE'
        token.avatar = u.avatar
        token.avatarColor = u.avatarColor
        token.photoUrl = u.photoUrl
      }
      // session güncellemesi tetiklenirse token'ı yenile
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name
        token.username = session.username ?? token.username
        token.avatar = session.avatar ?? token.avatar
        token.photoUrl = session.photoUrl ?? token.photoUrl
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).username = token.username
        ;(session.user as any).role = token.role || 'UYE'
        ;(session.user as any).avatar = token.avatar
        ;(session.user as any).avatarColor = token.avatarColor
        ;(session.user as any).photoUrl = token.photoUrl
      }
      return session
    },
  },
  pages: { signIn: '/auth/login', error: '/auth/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'girayoloji-local-dev-secret-key',
}
