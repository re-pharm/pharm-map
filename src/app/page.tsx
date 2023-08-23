import './page.css'
import Kmap from './Kmap';
import Location from './Location';

export default function Home() {
  let lat = 33.450701;
  let lng = 126.570667;

  return (
    <main className="flex">
      <section id="search" className="w-full sm:w-fit px-8 pt-8">
        <h1 className="text-2xl">
          <span className="blockText text-sm">우리동네</span>
          폐의약품 수거지도 💊
        </h1>
        <Location />
        <form name="resultData">
          <input type="text" inputMode="text" id="pharm" placeholder="장소명을 검색하세요"
            className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2"
          />
        </form>
      </section>
      <Kmap lat={lat} lng={lng} />
    </main>
  )
}
