// Theme-aware classes for the matching pages. Full class names so Tailwind sees them.
import type { ThemeKey } from '../theme'

export const MATCH_UI: Record<ThemeKey, { input: string; check: string; chipOn: string; badge: string; link: string; card: string }> = {
  meatloaf: {
    input: 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    check: 'h-4 w-4 accent-blue-600',
    chipOn: 'border-blue-600 bg-blue-50 text-blue-800',
    badge: 'bg-blue-100 text-blue-800',
    link: 'text-blue-600 hover:text-blue-800 font-semibold',
    card: 'bg-white rounded-2xl shadow-sm border border-gray-200',
  },
  mimosa: {
    input: 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400',
    check: 'h-4 w-4 accent-pink-500',
    chipOn: 'border-pink-500 bg-pink-50 text-pink-800',
    badge: 'bg-pink-100 text-pink-800',
    link: 'text-pink-600 hover:text-pink-800 font-semibold',
    card: 'bg-white rounded-2xl shadow-sm border border-pink-100',
  },
}
