import Header from "@/app/components/layouts/Header";
import Loading from "@/app/components/layouts/Loading";

export default function loading() {
  return <div>
      <section id="regionAndHeader" className="flex gap-2 mb-4">
          <Header isInfoPage={true} />
          <p className="text-lg md:text-2xl mt-5">
              |
              <span className="hidden md:inline">&nbsp;수거함 정보</span>
          </p>
      </section>
      <section id="info" className="flex shadow-lg p-4 rounded-2xl">
          <Loading />
      </section>
  </div>
}