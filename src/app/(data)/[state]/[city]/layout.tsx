import type { Metadata } from 'next';
import { metadata } from '@/app/layout';

type Params = {
  params: Promise<{
    state: string,
    city: string
  }>,
  children: React.ReactNode,
  dialog: React.ReactNode
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const validateResult = await fetch(`${process.env.SERVICE_URL
  }/api/geo/supported?type=single&state=${
    params.state}&city=${params.city}`).then((res) => res.json());

  if (validateResult.state.name) {
    return {
      title: `${validateResult.state.name} ${validateResult.city.name} | 폐의약품 수거지도`,
      description: `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함 위치를 확인하세요.`,
      openGraph: {
        type: "website",
        url: "https://pharm.paperbox.pe.kr",
        title: `${validateResult.state.name} ${validateResult.city.name} 폐의약품 수거지도`,
        description: `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함 위치를 확인하세요`
      }
    }
  } else {
    return metadata;
  }
}

export default function ResultLayout(props: Params) {
  return (
    <>
      {props.children}
      {props.dialog}
    </>
  )
}

export const runtime = 'edge';