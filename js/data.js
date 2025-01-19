let game = {}
let lastSaveTime = Date.now();

function loadGame() {
    let newGame = getNewGame();
    try {
        game = JSON.parse(LZString.decompress(localStorage.getItem(SAVE_KEY)))
        fixSave(game, newGame);
    } catch {
        game = newGame;
    }
}

function saveGame() {
    if (popups.draw.elms.list && popups.draw.state.phase != "done") return;
    try {
        localStorage.setItem(SAVE_KEY, LZString.compress(JSON.stringify(game)));
        lastSaveTime = Date.now();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

function getTextSaveString() {
    return LZString.compressToBase64(JSON.stringify(game));
}

function hardReset(keepOptions = true) {
    navigator.clipboard.writeText(LZString.compressToBase64(JSON.stringify(game)));
    if (keepOptions) localStorage.setItem(SAVE_KEY, LZString.compress(JSON.stringify({options: game.options})));
    else localStorage.removeItem(SAVE_KEY);
    saveGame = () => {};
    document.location.reload();
}

function fixSave(game, newGame) {
    for (let thing in newGame) {
        if (!(thing in game)) game[thing] = newGame[thing];
        else if (typeof newGame[thing] == "object") fixSave(game[thing], newGame[thing]);
    }
}