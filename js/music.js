let music = null;

function updateMusic() {
    if (!music) {
        if (!game.option.music) return;
        music = new Audio();
        music.loop = true;
        music.autoplay = true;
        music.volume = 0.7;
    }
    if (game.option.music) {
        let src = {
            "conscious": "res/music/consciousness_uploader.mp3",
        }[game.option.music];
        if (!src) return;
        if (music.src != src) music.src = src;
        music.play().catch(e => {
            let d = () => {
                updateMusic();
                document.body.removeEventListener("pointerdown", d);
            };
            spawnNotif("Click anywhere to enable background music").style.textAlign = "center";
            document.body.addEventListener("pointerdown", d);
        });
    } else {
        music.pause();
    }
}