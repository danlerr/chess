import { useState } from "react";
import { GoPlus } from "react-icons/go";

import Button from "./Button";

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
        <Button primary type="submit" aria-label="Salva" title="Salva">
            <GoPlus />
        </Button>
        </form>
    )
}

export default SaveGameForm