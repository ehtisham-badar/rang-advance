function getNextBatterIndex(currentIndex) {
    return (currentIndex + 1) % 4;
}

function isGameOver(room) {
    return room.battersCompleted >= 4;
}

export { getNextBatterIndex, isGameOver };
