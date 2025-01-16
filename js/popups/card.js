popups.card = {
    state: {},
    elms: {},
    call(pack, rarity, id, mode) {
        this.state = {pack, rarity, id, mode};
        let popup = makePopup();

        let info = this.elms.info = $make("div.info");
        popup.$body.append(info);

        if (mode) {
            let actions = this.elms.actions = $make("div");

            popup.$body.append($make("hr"));
            popup.$body.append(actions);
            popup.$body.append($make("hr"));
        }

        let actions = $make("div.actions");
        popup.$body.append(actions);

        let close = $make("button.primary", "Close");
        close.onclick = () => popup.close();
        actions.append(close);

        addEvent("card-update", this.onUpdate);
        this.onUpdate();
        return popup;
    },
    onUpdate() {
        let localElms = popups.card.elms;
        let {pack, rarity, id} = popups.card.state;
        let data = cards[pack][rarity][id];
        let state = game.cards[pack]?.[rarity]?.[id];

        let level = 1, stars = 1;
        if (state) ({level, stars} = state);
        let curFx = [], newFx = null;
        fx = (x) => curFx[x];
        for (let f of data.effects) curFx.push(f(level, stars));

        localElms.info.innerHTML = `
            <div class="header">
                <h2><rarity rarity="${rarity}"></rarity> ${data.name}</h2>
                <small>${state ? `
                    ${data.crown 
                        ? ``
                        : `(<span class="number">+${format(state.amount)}</span> extra copies)<br>`
                    }
                    ${data.crown 
                        ? `(crowned card)`
                        : `(<span class="number">${format(state.stars)}/${format(5)}</span> stars)`
                    }
                    ${data.levelCost ? data.maxLevel
                        ? `(level <span class="number">${format(state.level)}/${format(data.maxLevel)}</span>)`
                        : `(level <span class="number">${format(state.level)}</span>)`
                        : ``
                    }
                ` : `
                    (card not yet owned)
                `}</small>
            </div>
            <div>
                ${format.effect(data.desc, curFx, newFx)}
            </div>
            <div class="quote">
                “${data.quote}“
            </div>
        `
    },
    onClose() {
        this.state = {};
        this.elms = {};
        removeEvent("card-update", this.onUpdate);
    }
}