import { Dispatch, SetStateAction, createContext } from "react";

export const IsRealtimeLocationEnabled = 
  createContext<{
    value: Boolean,
    set: Dispatch<SetStateAction<Boolean>>
  }|undefined>(undefined);

export type CurrentLoc = {
  lat: Number,
  lng: Number,
}