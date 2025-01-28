popups.currency = {
    state: {},
    elms: {},
    call(cur) {
        this.state = {cur};
        let data = currencies[cur];
        let popup = makePopup();

        let info = this.elms.info = $make("div.info");
        info.innerHTML = `
            <div class="header">
                <h2>${data.name}</h2>
                <small></small>
            </div>
            <div class="quote">
                “${verbify(data.quote)}“
            </div>
        `
        this.elms.small = info.querySelector("small");
        popup.$body.append(info);

        let actions = $make("div.actions");
        popup.$body.append(actions);

        let close = $make("button.primary", "Close");
        close.onclick = () => popup.close();
        actions.append(close);

        addEvent("frame", this.onUpdate);
        this.onUpdate();
        return popup;
    },
    onUpdate() {
        let state = popups.currency.state;
        let localElms = popups.currency.elms;
        let cur = state.cur;
        localElms.small.innerHTML = getCurrencyInfo(cur);
    },
    onClose() {
        this.state = {};
        this.elms = {};
        removeEvent("frame", this.onUpdate);
    }
}