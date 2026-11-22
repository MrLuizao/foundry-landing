import en from '~/locales/en'
import es from '~/locales/es'

export type Locale = 'en' | 'es'
export type Messages = typeof en

const messages: Record<Locale, Messages> = { en, es }

export function useI18n() {
  const cookie = useCookie<Locale>('fundere_locale', {
    default: () => 'en',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const locale = useState<Locale>('fundere_locale', () => cookie.value || 'en')

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    cookie.value = newLocale
  }

  const toggleLocale = () => {
    setLocale(locale.value === 'en' ? 'es' : 'en')
  }

  const t = computed(() => messages[locale.value] ?? messages.en)

  return {
    locale,
    setLocale,
    toggleLocale,
    t,
  }
}
