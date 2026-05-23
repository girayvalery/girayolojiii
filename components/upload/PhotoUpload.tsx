'use client'
import { useState, useRef } from 'react'
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary'

type Props = {
  onUpload: (url: string, file?: File) => void
  type?: 'image' | 'video' | 'any'
  currentUrl?: string
  label?: string
  maxSizeMB?: number
  aspectRatio?: 'square' | 'wide' | 'vertical'
}

export default function PhotoUpload({
  onUpload, type = 'image', currentUrl,
  label = 'Yükle', maxSizeMB = 10, aspectRatio = 'wide',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentUrl || '')
  const [previewType, setPreviewType] = useState<'image' | 'video'>('image')

  const configured = isCloudinaryConfigured()

  async function handleFile(file: File) {
    setError('')
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Dosya çok büyük. Maks ${maxSizeMB}MB.`)
      return
    }

    const isVideo = file.type.startsWith('video/')
    setPreviewType(isVideo ? 'video' : 'image')

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    try {
      const result = await uploadToCloudinary(file, isVideo ? 'video' : 'image')
      setPreview(result.url)
      onUpload(result.url, file)
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
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>📸 Cloudinary kurulumu yapılmamış</p>
      </div>
    )
  }

  const containerClass =
    aspectRatio === 'vertical' || aspectRatio === 'square' ? 'max-w-[280px] mx-auto' : 'w-full'
  const aspectStyle =
    aspectRatio === 'vertical' ? { aspectRatio: '9/16' } :
    aspectRatio === 'square' ? { aspectRatio: '1/1' } :
    { height: '12rem' }

  const accept =
    type === 'image' ? 'image/*' :
    type === 'video' ? 'video/*' :
    'image/*,video/*'

  // Önizleme için file tipini belirle (currentUrl varsa URL'den anlamaya çalış)
  let displayType: 'image' | 'video' = previewType
  if (preview && preview === currentUrl) {
    if (preview.match(/\.(mp4|mov|webm|avi)$/i)) displayType = 'video'
    else if (preview.match(/\.(jpg|jpeg|png|gif|webp)$/i)) displayType = 'image'
  }
  if (type === 'video') displayType = 'video'
  if (type === 'image') displayType = 'image'

  return (
    <div>
      <input ref={inputRef} type="file" accept={accept} onChange={onChange} className="hidden" />

      <div className={containerClass}>
        {preview ? (
          <div className="relative" style={aspectStyle}>
            {displayType === 'image' ? (
              <img src={preview} alt="Önizleme" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <video src={preview} className="w-full h-full object-cover rounded-xl bg-black" controls playsInline />
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: 'rgba(0,0,0,0.7)' }}>
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
            className="rounded-xl p-8 text-center cursor-pointer transition-all hover:scale-[1.01] flex flex-col items-center justify-center"
            style={{ ...aspectStyle, background: 'var(--bg-subtle)', border: '2px dashed var(--border)' }}>
            <div className="text-5xl mb-2">
              {type === 'image' ? '📸' : type === 'video' ? '🎬' : '📷'}
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{label}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {type === 'any' ? `Resim veya video · Maks ${maxSizeMB}MB` :
               type === 'image' ? `JPG, PNG, GIF · Maks ${maxSizeMB}MB` :
               `MP4, MOV · Maks ${maxSizeMB}MB`}
            </p>
            {aspectRatio === 'vertical' && (
              <p className="text-xs mt-2 px-2 py-1 rounded-full" style={{ background: 'rgba(29,158,117,0.15)', color: '#1D9E75' }}>📱 Dikey 9:16</p>
            )}
          </div>
        )}

        {error && <p className="text-xs mt-2 text-red-400">⚠️ {error}</p>}
      </div>
    </div>
  )
}
