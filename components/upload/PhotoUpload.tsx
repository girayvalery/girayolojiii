'use client'
import { useState, useRef } from 'react'
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

type Props = {
  onUpload: (url: string) => void
  type?: 'image' | 'video'
  currentUrl?: string
  label?: string
  maxSizeMB?: number
}

export default function PhotoUpload({
  onUpload,
  type = 'image',
  currentUrl,
  label = 'Fotoğraf Yükle',
  maxSizeMB = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentUrl || '')

  const configured = isCloudinaryConfigured()

  async function handleFile(file: File) {
    setError('')
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Dosya çok büyük. Maks ${maxSizeMB}MB.`)
      return
    }

    // Preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setUploading(true)
    try {
      const result = await uploadToCloudinary(file, type)
      setPreview(result.url)
      onUpload(result.url)
    } catch (err: any) {
      setError(err.message || 'Yükleme başarısız oldu.')
      setPreview(currentUrl || '')
    } finally {
      setUploading(false)
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  if (!configured) {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: 'var(--bg-subtle)', border: '1px dashed var(--border)' }}>
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>📸 Yükleme Servisi Kapalı</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Cloudinary ayarları yapılmamış. .env.local dosyasına<br />
          <code className="px-1 rounded" style={{ background: 'var(--bg)', color: '#1D9E75' }}>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> ve<br />
          <code className="px-1 rounded" style={{ background: 'var(--bg)', color: '#1D9E75' }}>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> ekle.
        </p>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={onChange}
        className="hidden"
        capture={type === 'video' ? 'environment' : undefined}
      />

      {preview ? (
        <div className="relative">
          {type === 'image' ? (
            <img src={preview} alt="Önizleme" className="w-full h-48 object-cover rounded-xl" />
          ) : (
            <video src={preview} className="w-full h-48 object-cover rounded-xl" controls />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="text-white text-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">Yükleniyor...</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            ✏️ Değiştir
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          className="rounded-xl p-8 text-center cursor-pointer transition-all hover:scale-[1.01]"
          style={{ background: 'var(--bg-subtle)', border: '2px dashed var(--border)' }}>
          <div className="text-4xl mb-2">{type === 'image' ? '📸' : '🎬'}</div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{label}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {type === 'image' ? 'JPG, PNG, GIF · Maks ' + maxSizeMB + 'MB' : 'MP4, MOV · Maks ' + maxSizeMB + 'MB'}
          </p>
          <p className="text-xs mt-2" style={{ color: '#1D9E75' }}>
            Tıkla veya sürükle bırak
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs mt-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(226,75,74,0.1)', color: '#e24b4a' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  )
}
