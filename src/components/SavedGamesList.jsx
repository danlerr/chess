
const RESULT_LABEL = {
  ongoing: "in corso",
  checkmate: "matto",
  stalemate: "stallo",
  timeout: "tempo scaduto",
};

const NAME = { white: "bianco", black: "nero" };

function SavedGamesList({ games }) {
  if (games.length === 0) {
    return <p className="saved-empty">Nessuna partita salvata</p>;
  }

  return (
    <ul className="saved-list">
      {games.map(game => (
        <li key={game.id} className="saved-item">
          <span className="saved-title">{game.title}</span>
          <span className="saved-meta">
            {RESULT_LABEL[game.result]}
            {game.winner && `, vince il ${NAME[game.winner]}`}
            {` · ${game.moves.length} mosse`}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default SavedGamesList