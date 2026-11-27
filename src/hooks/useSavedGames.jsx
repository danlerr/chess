import { useContext } from "react";
import { SavedGamesContext } from "../context/savedGames";


export function useSavedGames(){
    const ctx = useContext(SavedGamesContext)
    if (!ctx) {
        throw new Error("useSavedGames deve essere usato dentro <SavedGamesProvider>")
    }
    return ctx
}