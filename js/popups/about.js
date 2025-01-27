popups.about = {
    call() {
        let popup = makePopup();

        let blabs = [
            "(because we can't help ourselves from inflating free " + getVerb("draw") + " counts)",
            "(because we can't help ourselves from advertising free " + getVerb("draw") + " counts)",
            "(no-download game with cutting-edge web technologies)",
            "(about as generous a gacha game could be)",
            "(and you thought a-thousand-ish was too much)",
            "<marquee>(look ma, i'm in a &lt;marquee&gt; tag!)</marquee>"
        ]

        popup.$body.innerHTML = `
            <div class="about-scroll">
                <hgroup class="header">
                    <h1><span class="number">One Trillion</span> Free ${getVerb("Draws")}</h1>
                    <i><small>${blabs[Math.floor(Math.random() * blabs.length)]}</small></i>
                </hgroup>
                <p>
                    Game by {https://ducdat0507.github.io|duducat / ducdat0507}
                </p>
                <p>
                    Used libraries:
                    <br>{https://ducdat0507.github.io/lootalot|lootalot}
                    | {https://github.com/pieroxy/lz-string|lz-string}
                </p>
                <hr><p>
                    Music by {https://ducdat0507.github.io|duducat}
                    <small class="unimportant">(hey that's me)</small>
                </p>
                <hr><p>
                    Icons from various sources via {https://iconify.design|Iconify}
                </p>
                <p>
                    <small class="unimportant">
                        (would the game count as parody and thus eligible for fair use?
                        <br>idk, i'm not a lawyer)
                    </span>
                </p>
            </div>
        `.replaceAll(/\{([^\|]+)\|([^\}]+)\}/g, "<a target='_blank' href='$1'>$2</a>")
        popup.$body.classList.add("no-scroll");

        let actions, btn;
        popup.$body.append(popup.$actions = actions = $make("div.actions"));
        btn = $make("button.primary", "Close");
        btn.onclick = popup.close;
        actions.append(btn);

        return popup;
    },
}