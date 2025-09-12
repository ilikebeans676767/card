popups.endgame = {
    call() {
        let popup = makePopup();

        let i18n = str.popups.endgame

        popup.$body.append(popup.$header = $make("h3.header", i18n.title()));
        popup.$body.append(popup.$content = $makeHTML("div", `
            <p>${i18n.strings.body1()}</p>
            <p>${i18n.strings.body2(
                `<a href="https://duducat.moe">${i18n.strings.body2_link0()}</a>`
            )}</p>
            <p>${i18n.strings.time(_number(format.time(game.stats.timePlayed, 4)))}</p>
        `));

        let actions, btn;
        popup.$body.append(popup.$actions = actions = $make("div.actions"));
        btn = $make("button.primary", str.popups.common.action_close());
        btn.onclick = popup.close;
        actions.append(btn);

        return popup;
    },
}