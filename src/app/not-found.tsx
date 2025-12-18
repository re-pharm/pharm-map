import Link from 'next/link'
import Header from './components/layouts/Header'
 
export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="m-4">
        <h2 className="text-2xl">404 Not Found</h2>
        <p>페이지를 찾을 수 없습니다.</p>
        <Link href="/">돌아가기</Link>
      </div>
    </div>
  )
}