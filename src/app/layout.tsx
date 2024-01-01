import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL("https://pharm.paperbox.pe.kr"),
  title: '폐의약품 수거지도',
  description: '우리동네 폐의약품 수거함 위치를 확인하세요',
  openGraph: {
    type: "website",
    url: "https://pharm.paperbox.pe.kr",
    title: `폐의약품 수거지도`,
    description: `우리동네 폐의약품 수거함 위치를 확인하세요`
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex h-full px-4 pt-4 gap-4 md:px-8 md:pt-8 md:gap-8">
          {children}
        </div>
        <footer className="mx-4 md:mx-8 my-2 md:my-4 h-[2rem]">
          <p>
            © 2023-24 Re:Pharm 프로젝트 및 &nbsp;
            <a href="https://github.com/re-pharm/pharm-map/graphs/contributors" target="_blank">기여자</a>. &nbsp;
            <a href="https://github.com/re-pharm/pharm-map/blob/main/README.md" target="_blank">오픈소스 라이선스 확인하기</a>
          </p>
        </footer>  
      </body>
    </html>
  )
}
