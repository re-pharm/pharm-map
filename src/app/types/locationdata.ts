import { Dispatch, SetStateAction, createContext } from "react";

export const RealtimeLocationData = 
    createContext<{
        value: CurrentLoc | undefined,
        set: Dispatch<SetStateAction<CurrentLoc | undefined>>
    }|undefined>(undefined);

export type CurrentLoc = {
    lat: string,
    lng: string
}