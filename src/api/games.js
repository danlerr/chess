import { supabase } from "./supabase";

export async function listGames() {
    const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at")
    if (error) throw error
    return data
}

export async function createGame(game) {
    const { data, error } = await supabase
        .from("games")
        .insert(game)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateGame (id, patch){
    const { data, error } = await supabase
        .from("games")
        .update(patch)
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteGame(id) {
    const { error } = await supabase
        .from("games")
        .delete()
        .eq("id", id)
    if (error) throw error
}