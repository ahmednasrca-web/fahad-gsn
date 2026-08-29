import type { Locale } from '@/lib/types'

export const LOCALES: Locale[] = ['ar', 'en']
export const DEFAULT_LOCALE: Locale = 'ar'

export const LOCALE_COOKIE = 'fahad_locale'

export function isRTL(locale: Locale): boolean {
  return locale === 'ar'
}

export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

// Translations
export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    gallery: 'المعرض',
    about: 'من نحن',
    contact: 'تواصل',
    // Gallery
    allWorks: 'جميع الأعمال',
    noWorks: 'لا توجد أعمال في هذا التصنيف بعد',
    viewDetails: 'تفاصيل',
    price: 'السعر',
    inquire: 'استفسار عبر واتساب',
    inquireMessage: 'مرحباً، أودّ الاستفسار عن هذا العمل: ',
    relatedWorks: 'أعمال مشابهة',
    // Contact
    contactTitle: 'تواصل معنا',
    contactSubtitle: 'نحن هنا للإجابة على استفساراتك',
    whatsapp: 'واتساب',
    phone: 'الهاتف',
    sendMessage: 'أرسل رسالة',
    yourName: 'اسمك',
    yourEmail: 'بريدك الإلكتروني (اختياري)',
    yourPhone: 'رقم هاتفك (اختياري)',
    yourMessage: 'رسالتك',
    messageSent: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
    messageError: 'حدث خطأ. حاول مرة أخرى.',
    // About
    aboutTitle: 'من نحن',
    // Footer
    footerRights: '© 2025 فهد غصن. جميع الحقوق محفوظة.',
    // Errors
    notFound: 'الصفحة غير موجودة',
    backHome: 'العودة للرئيسية',
  },
  en: {
    // Navigation
    home: 'Home',
    gallery: 'Gallery',
    about: 'About',
    contact: 'Contact',
    // Gallery
    allWorks: 'All Works',
    noWorks: 'No works in this category yet',
    viewDetails: 'Details',
    price: 'Price',
    inquire: 'Inquire via WhatsApp',
    inquireMessage: 'Hello, I would like to inquire about this work: ',
    relatedWorks: 'Related Works',
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'We are here to answer your inquiries',
    whatsapp: 'WhatsApp',
    phone: 'Phone',
    sendMessage: 'Send Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email (optional)',
    yourPhone: 'Your Phone (optional)',
    yourMessage: 'Your Message',
    messageSent: 'Your message was sent successfully. We will contact you soon.',
    messageError: 'An error occurred. Please try again.',
    // About
    aboutTitle: 'About Us',
    // Footer
    footerRights: '© 2025 Fahad Gsn. All rights reserved.',
    // Errors
    notFound: 'Page Not Found',
    backHome: 'Back to Home',
  },
} as const

export type TranslationKey = keyof typeof translations.ar

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key]
}

// Helper: get localized work title
export function getWorkTitle(work: { titleAr: string; titleEn: string }, locale: Locale): string {
  return locale === 'ar' ? work.titleAr : work.titleEn
}

// Helper: get localized work description
export function getWorkDescription(
  work: { descriptionAr?: string; descriptionEn?: string },
  locale: Locale,
): string | undefined {
  return locale === 'ar' ? work.descriptionAr : work.descriptionEn
}

// Helper: get localized category name
export function getCategoryName(
  category: { nameAr: string; nameEn: string },
  locale: Locale,
): string {
  return locale === 'ar' ? category.nameAr : category.nameEn
}

// Helper: get localized site content value
export function getContentValue(
  content: { valueAr?: string | null; valueEn?: string | null },
  locale: Locale,
): string | null {
  const val = locale === 'ar' ? content.valueAr : content.valueEn
  return val ?? null
}
