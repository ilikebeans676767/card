popups.badge = {
    call(badge) {
        let popup = makePopup();

        let data = badges[badge];
        let obtained = !!game.badges[badge];

        let info = $make("div.info");
        info.innerHTML = `
            <div class="header">
                <h2>${verbify(data.name)}</h2>
                <small>(${obtained ? "obtained " : "locked "}badge)</small>
            </div>
            <div>
                ${obtained ? verbify(data.desc) : "???"}
            </div>
        `
        popup.$body.append(info);

        let actions = $make("div.actions");
        popup.$body.append(actions);

        let close = $make("button.primary", "Close");
        close.onclick = () => popup.close();
        actions.append(close);

        return popup;
    },
    onClose() {
        this.state = {};
        this.elms = {};
    }
}