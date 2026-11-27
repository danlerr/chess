import { useState } from "react";

import { GoTrash, GoPencil } from "react-icons/go"

import Button from "./Button";
import { useSavedGames } from "../hooks/useSavedGames";
import { deleteGame } from "../api/games";

const RESULT_LABEL = {
  ongoing: "in corso",
  checkmate: "matto",
  stalemate: "stallo",
  timeout: "tempo scaduto",
};

const NAME = { white: "bianco", black: "nero" };

function SavedGamesList() {

  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")

  const { savedGames, renameGame, removeGame } = useSavedGames()

  if (savedGames.length === 0) {
    return <p className="saved-empty">Nessuna partita salvata</p>;
  }

function startEdit(game){
  setEditingId(game.id)
  setDraft(game.title)
}

function cancelEdit(){
  setEditingId(null)
  setDraft("")
}

function handleRenameSubmit(e){
  e.preventDefault()
  const trimmed = draft.trim()
  if (!trimmed) return
  renameGame(editingId, trimmed)
  setEditingId(null)
}

  return (
    <ul className="saved-list">
      {savedGames.map(game =>
        game.id === editingId ? (
          <li key={game.id} className="saved-item">
            <form className="rename-form" onSubmit={handleRenameSubmit}>
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
              />
              <Button type="submit">Salva</Button>
              <Button type="button" onClick={cancelEdit}>Annulla</Button>
            </form>
          </li>
        ) : (
          <li key={game.id} className="saved-item">
            <div className="saved-info">
              <span className="saved-title">{game.title}</span>
              <span className="saved-meta">
                {RESULT_LABEL[game.result]}
                {game.winner && `, vince il ${NAME[game.winner]}`}
                {` · ${game.moves.length} mosse`}
              </span>
            </div>
            <div className="saved-actions">
              <Button onClick={() => startEdit(game)} aria-label="Rinomina" title="Rinomina">
                <GoPencil />
              </Button>
              <Button danger onClick={() => removeGame(game.id)} aria-label="Elimina" title="Elimina">
                <GoTrash />
              </Button>
            </div>
          </li>
        )
      )}
    </ul>
  )
}

export default SavedGamesList