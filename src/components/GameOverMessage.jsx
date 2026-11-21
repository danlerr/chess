
const NAME = { white: "bianco", black: "nero"}

function GameOverMessage({ gameOver, checkedColor }){
    if (gameOver) {
        if (gameOver.result === "checkmate") {
        return <p className="gameover-banner">Matto! Vince il {NAME[gameOver.winner]}</p>;
        }
        if (gameOver.result === "timeout") {
        return <p className="gameover-banner">Tempo scaduto! Vince il {NAME[gameOver.winner]}</p>;
        }
        return <p className="gameover-banner">Stallo (patta)</p>;
    }

    if (checkedColor) {
        return <p className="check-banner">Scacco al {NAME[checkedColor]}</p>;
    }

    return null;
}

export default GameOverMessage