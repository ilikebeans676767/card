let game = {}

const SAVE_KEY = "gacha";

function getNewGame() {
    return {
        res: {
            points: 0,
            draws: 1e12,
        },
        cards: {}
    }
}

function loadGame() {
    let newGame = getNewGame();
    try {
        game = fixSave(JSON.parse(LZString.decompress(localStorage.getItem(SAVE_KEY))))
    } catch {
        game = newGame;
    }
}

function saveGame() {
    try {
        localStorage.setItem(SAVE_KEY, LZString.compress(JSON.stringify(game)));
    } catch (e) {
        console.error(e);
    }
}

function fixSave(game, newGame) {
    for (let thing in newGame) {
        if (!(thing in game)) game[thing] = newGame[thing];
        else if (typeof newGame[thing] == "object") fixSave(game[thing], newGame[thing]);
    }
}