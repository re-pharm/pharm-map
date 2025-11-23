import { createContext } from "react";

export const RegionData = createContext<{
    state: string,
    city: string
}|undefined>(undefined);