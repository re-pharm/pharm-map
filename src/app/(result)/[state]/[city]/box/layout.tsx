import { validateLocationValue } from "@/app/functions/data/validateLocationData";
import Header from "@/app/components/layouts/Header"
import Link from "next/link";

export default function IndependantBoxInfoLayout({ children, params }: {
    children: React.ReactNode,
    params: {
      state: string,
      city: string
    }
}) {
    const validateResult = validateLocationValue(params.state, params.city);

    return (
        <div>
            <section id="regionAndHeader" className="flex gap-2 mb-4">
                <Header isInfoPage={true} />
                <p className="text-lg md:text-2xl mt-[1.25rem]">
                    |&nbsp;
                    <Link href={`/${params.state}/${params.city}`}
                        className="no-underline hover:after:content-['→'] focus:after:content-['→']" >
                        {validateResult.state} {validateResult.city}
                    </Link>
                    <span className="hidden md:inline">&nbsp;수거함 정보</span>
                </p>
            </section>
            <section id="content" className="">
                {children}
            </section>
        </div>
    )
}

export const runtime = 'edge';