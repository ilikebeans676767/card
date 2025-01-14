let elms = {}

document.addEventListener("DOMContentLoaded", () => {

    elms.currencies = $("#currencies");
    elms.currencies.append(elms.currencies.$cards = createCurrencyUI({}));
    elms.currencies.append(elms.currencies.$points = createCurrencyUI(currencies.points));

    elms.draw = $("#draw-button");
    elms.draw.onclick = onDrawButtonClick;
    elms.draw.$action = $("#draw-button-action");
    elms.draw.$amount = $("#draw-button-amount");

    elms.tooltip = $("#tooltip");

    elms.tab = $("#tab-content");
    elms.tab.$buttons = $("#tab-buttons");
    initTabs();

    loadGame();
    updateEffects();
    setTab("collection");
    time = performance.now();
    requestAnimationFrame(loop);
    
    $("#loading").remove();
});

let time = 0;
let delta = 0;

function loop() {
    delta = performance.now() - time;
    time += delta;
    game.time.now = Date.now();

    onFrame();

    requestAnimationFrame(loop);
}