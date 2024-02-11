import { IconDefinition, faAsterisk, faBuildingColumns, faCapsules, faDumbbell, faEnvelopesBulk, faHandHoldingHeart, faPersonPraying } from "@fortawesome/free-solid-svg-icons";

export type Data = {
    id: number,
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

export type OriginalData = {
    id: number,
    name: string,
    address: string,
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
    post: "우체통",
    gym: "체육시설",
    welfare: "복지시설",
    religion: "종교시설",
    others: "기타"
}

export const organizationIcons: OrganizationIcons = {
    pharm: faCapsules,
    public: faBuildingColumns,
    post: faEnvelopesBulk,
    gym: faDumbbell,
    welfare: faHandHoldingHeart,
    religion: faPersonPraying,
    others: faAsterisk
}