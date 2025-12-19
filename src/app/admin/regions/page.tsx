import { getStates } from "./actions";
import ManageRegionClient from "@/app/components/locations/ManageRegionClient";

export default async function AdminRegionPage() {
  const registered_states = await getStates();

  return (
    <>
      <h3 className="text-2xl">지역 관리</h3>
      <ManageRegionClient registered_states={registered_states} />
    </>
  );
}
