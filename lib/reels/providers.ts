import type { ReelProvider } from '@/lib/types'

export interface ReelValidationResult {
  provider: ReelProvider
  contentId: string
  originalUrl: string
  embedUrl: string
  watchUrl: string
  thumbnailUrl?: string
}

export interface ProviderMeta {
  name: string
  nameAr: string
  icon: string // emoji or identifier
  color: string // Tailwind or HEX badge style
  badgeBg: string
  badgeText: string
  aspectRatio: 'vertical' | 'standard' // 'vertical' (9:16) or 'standard' (16:9)
}

export const PROVIDER_META: Record<ReelProvider, ProviderMeta> = {
  instagram: {
    name: 'Instagram',
    nameAr: 'إنستغرام',
    icon: '📸',
    color: '#E1306C',
    badgeBg: 'bg-gradient-to-r from-[#833ab4]/15 via-[#fd1d1d]/15 to-[#fcb045]/15 border-[#E1306C]/30',
    badgeText: 'text-[#C13584]',
    aspectRatio: 'vertical',
  },
  youtube: {
    name: 'YouTube',
    nameAr: 'يوتيوب',
    icon: '▶️',
    color: '#FF0000',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-600',
    aspectRatio: 'vertical', // Shorts default, but supports standard
  },
  tiktok: {
    name: 'TikTok',
    nameAr: 'تيك توك',
    icon: '🎵',
    color: '#000000',
    badgeBg: 'bg-neutral-900/10 border-neutral-900/30 dark:bg-white/10',
    badgeText: 'text-neutral-900',
    aspectRatio: 'vertical',
  },
  facebook: {
    name: 'Facebook',
    nameAr: 'فيسبوك',
    icon: '📘',
    color: '#1877F2',
    badgeBg: 'bg-blue-600/10 border-blue-600/30',
    badgeText: 'text-[#1877F2]',
    aspectRatio: 'vertical',
  },
}

/**
 * Validates untrusted input URL and extracts provider + safe content ID.
 * Throws an Error with an Arabic descriptive message if the URL is invalid or unsupported.
 */
export function detectAndValidateReelUrl(inputUrl: string): ReelValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    throw new Error('يرجى إدخال رابط صحيح')
  }

  const trimmed = inputUrl.trim()
  let urlObj: URL
  try {
    urlObj = new URL(trimmed)
  } catch {
    throw new Error('الرابط المدخل غير صالح. تأكد من كتابة الرابط كاملاً يبدأ بـ https://')
  }

  if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
    throw new Error('يجب أن يبدأ الرابط بـ https://')
  }

  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '')
  const pathname = urlObj.pathname

  // ─── 1. YouTube ─────────────────────────────────────────────────────────────
  if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'youtu.be') {
    let videoId: string | null = null
    let isShort = false

    if (hostname === 'youtu.be') {
      const match = pathname.match(/^\/([A-Za-z0-9_-]{6,15})/)
      if (match) videoId = match[1]
    } else if (pathname.startsWith('/shorts/')) {
      const match = pathname.match(/^\/shorts\/([A-Za-z0-9_-]{6,15})/)
      if (match) {
        videoId = match[1]
        isShort = true
      }
    } else if (pathname.startsWith('/watch')) {
      const v = urlObj.searchParams.get('v')
      if (v && /^[A-Za-z0-9_-]{6,15}$/.test(v)) {
        videoId = v
      }
    } else if (pathname.startsWith('/embed/')) {
      const match = pathname.match(/^\/embed\/([A-Za-z0-9_-]{6,15})/)
      if (match) videoId = match[1]
    }

    if (!videoId) {
      throw new Error('لم يتم العثور على معرف فيديو YouTube صالح في الرابط')
    }

    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    const watchUrl = isShort
      ? `https://www.youtube.com/shorts/${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    return {
      provider: 'youtube',
      contentId: videoId,
      originalUrl: trimmed,
      embedUrl,
      watchUrl,
      thumbnailUrl,
    }
  }

  // ─── 2. Instagram ───────────────────────────────────────────────────────────
  if (hostname === 'instagram.com' || hostname === 'instagr.am') {
    const match = pathname.match(/\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/)
    if (!match || !match[2]) {
      throw new Error('رابط Instagram غير صالح. يرجى استخدام رابط Reel أو Post مثل https://www.instagram.com/reel/CODE/')
    }

    const shortcode = match[2]
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`
    const watchUrl = `https://www.instagram.com/reel/${shortcode}/`

    return {
      provider: 'instagram',
      contentId: shortcode,
      originalUrl: trimmed,
      embedUrl,
      watchUrl,
    }
  }

  // ─── 3. TikTok ──────────────────────────────────────────────────────────────
  if (hostname === 'tiktok.com' || hostname === 'm.tiktok.com' || hostname === 'vm.tiktok.com') {
    let videoId: string | null = null

    if (hostname === 'vm.tiktok.com') {
      const match = pathname.match(/^\/([A-Za-z0-9_-]+)/)
      if (match) videoId = match[1]
    } else {
      const match = pathname.match(/(?:video|v)\/(\d+)/)
      if (match) {
        videoId = match[1]
      } else {
        const shortMatch = pathname.match(/\/t\/([A-Za-z0-9_-]+)/)
        if (shortMatch) videoId = shortMatch[1]
      }
    }

    if (!videoId) {
      throw new Error('رابط TikTok غير صالح. يرجى استخدام رابط فيديو تيك توك مباشر')
    }

    const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`
    const watchUrl = trimmed

    return {
      provider: 'tiktok',
      contentId: videoId,
      originalUrl: trimmed,
      embedUrl,
      watchUrl,
    }
  }

  // ─── 4. Facebook ────────────────────────────────────────────────────────────
  if (hostname === 'facebook.com' || hostname === 'web.facebook.com' || hostname === 'm.facebook.com' || hostname === 'fb.watch') {
    let videoId: string | null = null

    if (hostname === 'fb.watch') {
      const match = pathname.match(/^\/([A-Za-z0-9_-]+)/)
      if (match) videoId = match[1]
    } else {
      const reelMatch = pathname.match(/\/(?:reel|reels)\/(\d+)/)
      if (reelMatch) {
        videoId = reelMatch[1]
      } else {
        const videoMatch = pathname.match(/\/videos\/(\d+)/)
        if (videoMatch) {
          videoId = videoMatch[1]
        } else {
          const v = urlObj.searchParams.get('v')
          if (v && /^\d+$/.test(v)) videoId = v
        }
      }
    }

    const sanitizedId = videoId || 'fb_video'
    const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0&autoplay=1`
    const watchUrl = trimmed

    return {
      provider: 'facebook',
      contentId: sanitizedId,
      originalUrl: trimmed,
      embedUrl,
      watchUrl,
    }
  }

  throw new Error('المنصة غير مدعومة. المنصات المدعومة حالياً: Instagram, YouTube, TikTok, Facebook')
}

/**
 * Builds safe embed URL directly from provider and contentId stored in DB.
 */
export function getSafeEmbedUrl(provider: ReelProvider, contentId: string, originalUrl: string): string {
  switch (provider) {
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(contentId)}?autoplay=1&rel=0&modestbranding=1`
    case 'instagram':
      return `https://www.instagram.com/p/${encodeURIComponent(contentId)}/embed/`
    case 'tiktok':
      return `https://www.tiktok.com/embed/v2/${encodeURIComponent(contentId)}`
    case 'facebook':
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalUrl)}&show_text=0&autoplay=1`
    default:
      return originalUrl
  }
}

/**
 * Builds direct watch link for fallback.
 */
export function getSafeWatchUrl(provider: ReelProvider, contentId: string, originalUrl: string): string {
  switch (provider) {
    case 'youtube':
      return `https://www.youtube.com/watch?v=${encodeURIComponent(contentId)}`
    case 'instagram':
      return `https://www.instagram.com/reel/${encodeURIComponent(contentId)}/`
    default:
      return originalUrl
  }
}
