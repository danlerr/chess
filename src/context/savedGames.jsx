import { createContext, useState, useEffect } from "react";

import { listGames, createGame, updateGame, deleteGame } from "../api/games";

export const SavedGamesContext = createContext(null)

export function SavedGamesProvider({ children }){


    const [savedGames, setSavedGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // CrUD handler 

    //-- load games - read operation (cRud)
    // Read
    useEffect(() => {
        async function load() {
        try {
            const gs = await listGames()
            setSavedGames(gs)
        } catch(err) {
            console.error(err)
            setError("Server non raggiungibile")
        } finally { setLoading(false) }
        }
        load()
    }, [])

    //Create
    async function saveGame(game){
        setError(null)
        try {
            const saved = await createGame(game)
            setSavedGames( s => [...s, saved])
        } catch(err) {
            console.log(err)
            setError("Salvataggio non riuscito")
        }
    }

    // Delete
    async function removeGame(id){
        setError(null)
        try {
            await deleteGame(id)
            setSavedGames(gs => gs.filter(g => g.id !== id))
        } catch (err) {
            console.log(err)
            setError("Eliminazione non riuscita")
        }
    }

    // Update
    async function renameGame(id, newTitle){
        setError(null)
        try {
            const updated = await updateGame(id, { title: newTitle })
            setSavedGames( gs => gs.map(
            g => g.id === id ? updated : g ))
        } catch(err) {
            console.log(err)
            setError("Modifica non riuscita")
        }
    }

    const valueToShare = { savedGames, loading, error, saveGame, renameGame, removeGame }


    return(
        <SavedGamesContext.Provider value={valueToShare}>
            {children}
        </SavedGamesContext.Provider>
    )
}