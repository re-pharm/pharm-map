import { createContext } from "react";

export type Data = {
    name: string,
    location: string,
    tel: string,
    type: string,
    lat: string,
    lng: string,
    distance?: number
};

type OrganizationType = {
    [index: string]: string
};

export const organizationType : OrganizationType = {
    pharm: "약국",
    public: "공공기관",
    post: "우체통"
}

export const RegionData = createContext<{
    state: string,
    city: string
}|undefined>(undefined);