import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '폐의약품 수거지도',
  description: '우리동네 폐의약품 수거함 위치를 확인하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
