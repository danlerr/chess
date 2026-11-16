function formatTime(seconds){
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

function Clock({ color, seconds, active }){
    return (
        <div className={`clock ${active ? 'active' : ''}`}>
            <span className="clock-label">{color === 'white' ? 'Bianco' : 'Nero'}</span>
            <span className="clock-time">{formatTime(seconds)}</span>
        </div>
    )
}

export default Clock