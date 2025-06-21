popups.sellResult = {
    state: {},
    elms: {},
    call(sellValue) {

        if (game.stats.accountsSold == 1) {
            let popup = callPopup("slideshow", 3);
            return popup;
        }

        let popup = makePopup();
        popup.classList.add("clear");

        let actions = $make("div.actions");
        popup.$body.append(actions);

        let close = $make("button.primary", str.popups.sellResult.action_continue());
        close.onclick = () => popup.close();
        actions.append(close);

        return popup;
    },
    onClose() {
        this.state = {};
        this.elms = {};
        setTimeout(() => {
            popups.sell.resume();
        }, 500);
    }
}