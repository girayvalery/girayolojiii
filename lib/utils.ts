const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr)
  const day = d.getDate()
  const month = TR_MONTHS[d.getMonth()]
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const mins = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${mins}`
}

export function timeAgo(dateStr: string | Date): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 30) return 'şimdi'
  if (diff < 60) return `${diff} sn önce`
  if (diff < 3600) {
    const mins = Math.floor(diff / 60)
    return `${mins} dk önce`
  }
  if (diff < 86400) {
    const hrs = Math.floor(diff / 3600)
    return `${hrs} saat önce`
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400)
    return `${days} gün önce`
  }
  if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800)
    return `${weeks} hafta önce`
  }
  if (diff < 31536000) {
    const months = Math.floor(diff / 2592000)
    return `${months} ay önce`
  }
  // 1 yıldan fazlaysa tam tarih
  return formatDate(dateStr)
}

export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toString()
}
