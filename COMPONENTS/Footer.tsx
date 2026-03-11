import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white/90 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Meatloaf" width={40} height={40} className="h-10 w-auto" />
          <span className="font-semibold text-gray-900">Meatloaf</span>
        </div>

        <div className="mt-4 md:mt-0 text-sm text-gray-600">
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/properties" className="hover:underline">Properties</Link>
            <Link href="/auth/login" className="hover:underline">Login</Link>
          </div>
          <div className="mt-3">© {new Date().getFullYear()} Meatloaf — All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
