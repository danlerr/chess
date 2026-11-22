
const RESULT_LABEL = {
  ongoing: "in corso",
  checkmate: "matto",
  stalemate: "stallo",
  timeout: "tempo scaduto",
};

const NAME = { white: "bianco", black: "nero" };

function SavedGamesList({ games, onDelete }) {
  if (games.length === 0) {
    return <p className="saved-empty">Nessuna partita salvata</p>;
  }

  return (
    <ul className="saved-list">
      {games.map(game => (
        <li key={game.id} className="saved-item">
          <div className="saved-info">
            <span className="saved-title">{game.title}</span>
            <span className="saved-meta">
              {RESULT_LABEL[game.result]}
              {game.winner && `, vince il ${NAME[game.winner]}`}
              {` · ${game.moves.length} mosse`}
            </span>
          </div>
          <button className="btn btn-danger" onClick={() => onDelete(game.id)}>Elimina</button>
        </li>
      ))}
    </ul>
  )
}

export default SavedGamesList