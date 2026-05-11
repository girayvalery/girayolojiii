import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { role } = await req.json()
  if (!['ADMIN', 'YAZAR', 'UYE'].includes(role)) {
    return NextResponse.json({ error: 'Geçersiz rol.' }, { status: 400 })
  }
  return NextResponse.json({ message: `${params.id} rolü ${role} olarak güncellendi (mock).` })
}
