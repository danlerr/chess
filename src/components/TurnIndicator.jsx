function TurnIndicator({ turn }){
    return <h1>Chess - tocca al {turn === 'white' ? 'bianco' : 'nero'}</h1>
}

export default TurnIndicator