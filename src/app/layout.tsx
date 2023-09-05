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
    <html lang="ko">
      <body>
        {children}
        <footer className="m-4">
          <p>
            © 2023 Re:Pharm 프로젝트 및 &nbsp;
            <a href="https://github.com/re-pharm/pharm-map/people" target="_blank">기여자</a>. &nbsp;
            <a href="https://github.com/re-pharm/pharm-map/blob/main/README.md" target="_blank">오픈소스 라이선스 확인하기</a>
          </p>
        </footer>  
      </body>
    </html>
  )
}
