import './page.css'
import Kmap from './Kmap';

export default function Home() {
  return (
    <main className="flex">
      <section id="search" className="w-full sm:w-fit px-8 pt-8">
        <h1 className="text-2xl">
          <span className="blockText text-sm">우리동네</span>
          폐의약품 수거지도 💊
        </h1>
        <form name="findPharm" className="my-4 flex flex-col gap-4">
          <div id="region" className="flex flex-row gap-2">
            <select id="state" className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400">
              <option>시/도</option>
            </select>
            <select id="city" className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400">
              <option>시/군/구</option>
            </select>
          </div>
          <input type="text" inputMode="text" id="pharm" placeholder="장소명을 검색하세요"
            className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2"
          />
        </form>
      </section>
      <Kmap />
    </main>
  )
}
