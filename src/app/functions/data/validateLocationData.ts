import data from "../../api/service/supported_region/region.json";
import type { RegionType } from "@/app/api/service/supported_region/route";

const region: RegionType = data;

export function validateLocationValue(stateCode: string, cityCode: string) {
    const stateData = region.state.find((province) => province.code === stateCode);

    if (stateData) {
        const cityData = region.city[stateData.code].find((town) => town.code === cityCode);
        if (cityData) {
            return {
                valid: true,
                state: stateData.name,
                city: cityData.name
            }
        }
    }
    
    return {
        valid: false
    }
}