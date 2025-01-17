let game = {}

const SAVE_KEY = "gacha";

function getNewGame() {
    return {
        res: {
            points: 0,
            shreds: 0,
            energy: 0,

            fire: 0,
            water: 0,
            leaf: 0,
            sun: 0,
            moon: 0,
        },
        time: {
            now: Date.now(),
            drawCooldown: 0,
        },
        stats: {
            cardsDrawn: 0
        },
        cards: {},
        drawPref: {
            faction: ""
        },
        option: {
            notation: "default",
            music: "",
        },
    }
}

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