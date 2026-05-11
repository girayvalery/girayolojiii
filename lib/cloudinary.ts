// Cloudinary client-side upload helper
// Hem mobil hem masaüstünde çalışır (file input ile)

export type UploadResult = {
  url: string
  publicId: string
  resourceType: 'image' | 'video'
}

export async function uploadToCloudinary(
  file: File,
  resourceType: 'image' | 'video' = 'image'
): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary ayarlanmamış. .env.local dosyasını kontrol et.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Yükleme başarısız oldu')
  }

  const data = await res.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType,
  }
}

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  )
}
