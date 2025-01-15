popups.card = {
    state: {},
    elms: {},
    call(pack, rarity, id) {
        let data = cards[pack][rarity][id];
        let state = game.cards[pack]?.[rarity]?.[id];

        let level = 1, stars = 1;
        if (state) ({level, stars} = state);
        let curFx = [], newFx = null;
        fx = (x) => curFx[x];
        for (let f of data.effects) curFx.push(f(level, stars));

        let popup = makePopup();
        let info = $make("div.info");
        info.innerHTML = `
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
        popup.$body.append(info);

        let actions = $make("div.actions");
        popup.$body.append(actions);

        let close = $make("button.primary", "Close");
        close.onclick = () => popup.close();
        actions.append(close);
    }
}