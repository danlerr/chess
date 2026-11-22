import { useState } from "react";

const RESULT_LABEL = {
  ongoing: "in corso",
  checkmate: "matto",
  stalemate: "stallo",
  timeout: "tempo scaduto",
};

const NAME = { white: "bianco", black: "nero" };

function SavedGamesList({ games, onDelete, onRename }) {

  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")

  if (games.length === 0) {
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
  onRename(editingId, trimmed)
  setEditingId(null)
}

  return (
    <ul className="saved-list">
      {games.map(game =>
        game.id === editingId ? (
          <li key={game.id} className="saved-item">
            <form className="rename-form" onSubmit={handleRenameSubmit}>
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn">Salva</button>
              <button type="button" className="btn" onClick={cancelEdit}>Annulla</button>
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
              <button className="btn" onClick={() => startEdit(game)}>Rinomina</button>
              <button className="btn btn-danger" onClick={() => onDelete(game.id)}>Elimina</button>
            </div>
          </li>
        )
      )}
    </ul>
  )
}

export default SavedGamesList