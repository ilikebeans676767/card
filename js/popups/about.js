popups.about = {
    call() {
        let popup = makePopup();

        let blabs = [
            "because we can't help ourselves from inflating free draw counts",
            "because we can't help ourselves from advertising free draw counts",
            "would the game count as parody and thus eligible for fair use?",
            "no-download game) (<- technically false since you still need to download this webpage",
            "and you thought 30,000 was too much"
        ]

        popup.$body.innerHTML = `
            <div class="about-scroll">
                <hgroup class="header">
                    <h1><span class="number">One Trillion</span> Free Draws</h1>
                    <i><small>(${blabs[Math.floor(Math.random() * blabs.length)]})</small></i>
                </hgroup>
                <p>
                    game by {https://ducdat0507.github.io|duducat / ducdat0507}
                </p>
                <p>
                    music by {https://ducdat0507.github.io|duducat / ducdat0507}
                    <small class="unimportant">(hey that's me)</small>
                </p>
                <p>
                    icons from various sources via {https://iconify.design|Iconify}
                </p>
            </div>
        `.replaceAll(/\{([^\|]+)\|([^\}]+)\}/g, "<a target='_blank' href='$1'>$2</a>")

        let actions, btn;
        popup.$body.append(popup.$actions = actions = $make("div.actions"));
        btn = $make("button.primary", "Close");
        btn.onclick = popup.close;
        actions.append(btn);

        return popup;
    },
}