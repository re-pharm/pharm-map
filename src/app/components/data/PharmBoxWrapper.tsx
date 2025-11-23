import Kmap from "../kakaomap/Kmap";
import PharmBoxInfo from "./PharmBoxInfo";

type Props = {
  state: string,
  city: string,
  id: string,
  isDialog: boolean
}

export default async function PharmBoxWrapper(props: Props) {
  const boxData = await fetch(`${process.env.SERVICE_URL
    }/api/data?state=${props.state}&city=${props.city}&id=${props.id}`)
    .then(async(result) => await result.json());
  
  if (props.isDialog) {
    return (
      <PharmBoxInfo currentData={boxData} />
    )
  } else {
    return (<>
      <PharmBoxInfo currentData={boxData} />
      <Kmap latLng={{
          lat: Number(boxData.lat),
          lng: Number(boxData.lng)
      }} data={[boxData]} />
    </>)
  }
  
}