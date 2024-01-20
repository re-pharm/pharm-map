import { IconDefinition, faBuildingColumns, faCapsules, faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";

export type Data = {
    name: string,
    location: string,
    tel: string,
    type: string,
    lat: string,
    lng: string,
    distance?: number,
    last_updated: string,
    memo: string | null
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