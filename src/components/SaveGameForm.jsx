import { useState } from "react";

function SaveGameForm({ onSave }){
    const [title, setTitle] = useState("")

    function handleSubmit(e){
        e.preventDefault();
        const trimmed = title.trim()
        if (!trimmed) return
        onSave(trimmed)
        setTitle("")
    }

    return(
        <form className="save-form" onSubmit={handleSubmit}>
        <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nome della partita"
        />
        <button type="submit">Salva partita</button>
        </form>
    )
}

export default SaveGameForm