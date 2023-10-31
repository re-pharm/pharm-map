import { IconDefinition, faBuildingColumns, faCapsules, faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";
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

type OrganizationIcons = {
    [index: string]: IconDefinition
}

export const organizationType: OrganizationType = {
    pharm: "약국",
    public: "공공기관",
    post: "우체통"
}

export const organizationIcons: OrganizationIcons = {
    pharm: faCapsules,
    public: faBuildingColumns,
    post: faEnvelopesBulk
}

export const RegionData = createContext<{
    state: string,
    city: string
}|undefined>(undefined);