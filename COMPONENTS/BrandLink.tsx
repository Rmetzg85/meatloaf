'use client'

// Logo + name that follow the site theme and link to that brand's home page.

import Image from 'next/image'
import Link from 'next/link'
import { THEMES } from './theme'
import { useSiteTheme } from './useSiteTheme'

const MIMOSA_NAME = 'bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent'

export default function BrandLink({
  className = 'flex items-center space-x-2',
  size = 40,
  imgClassName = 'h-10 w-auto',
  nameClassName = 'text-2xl font-bold text-gray-900',
}: {
  className?: string
  size?: number
  imgClassName?: string
  nameClassName?: string
}) {
  const theme = useSiteTheme()
  const t = THEMES[theme]
  const nameClass = theme === 'mimosa' ? nameClassName.replace('text-gray-900', MIMOSA_NAME) : nameClassName
  return (
    <Link href={t.home} className={className}>
      <Image src={t.logo} alt={t.name} width={size} height={size} className={imgClassName} />
      <span className={nameClass}>{t.name}</span>
    </Link>
  )
}
