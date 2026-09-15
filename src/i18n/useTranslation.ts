import { useEarthStore } from '../store/earthStore'
import { translations } from './translations'

export function useTranslation() {
  const language = useEarthStore((state) => state.language)
  return { language, t: translations[language] }
}
