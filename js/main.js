document.addEventListener("DOMContentLoaded", () => {
    loadGame();

    time = performance.now();
    requestAnimationFrame(loop);
});

let time = 0;
let delta = 0;

function loop() {
    delta = performance.now() - time;
    time += delta;

    onFrame();

    requestAnimationFrame(loop);
}