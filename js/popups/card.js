popups.card = {
    state: {},
    elms: {},
    call(pack, rarity, id, mode) {
        this.state = {pack, rarity, id, mode};
        let popup = makePopup();

        let info = this.elms.info = $make("div.info");
        popup.$body.append(info);

        if (mode) {
            let actions = this.elms.actions = $make("div.popup-card-actions");

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
        this.state.popup = popup;
        return popup;
    },
    onUpdate() {
        let localElms = popups.card.elms;
        let {pack, rarity, id, mode, viewType} = popups.card.state;
        let data = cards[pack][rarity][id];
        let state = game.cards[pack]?.[rarity]?.[id];

        let level = 1, stars = 1;
        if (state) ({level, stars} = state);
        let curFx = [], newFx = null;
        fx = (x) => curFx[x];
        for (let f of data.effects) curFx.push(f(level, stars));

        if (viewType == "level-up") {
            if (data.maxLevel && level >= data.maxLevel) {
                viewType = "";
            } else {
                newFx = [];
                fx = (x) => newFx[x];
                for (let f of data.effects) newFx.push(f(level + 1, stars));
            }
        } else if (viewType == "star-up") {
            if (stars >= 5) {
                viewType = "";
            } else {
                newFx = [];
                fx = (x) => newFx[x];
                for (let f of data.effects) newFx.push(f(level, stars + 1));
            }
        }

        function setViewType(type) {
            popups.card.state.viewType = popups.card.state.viewType == type ? "" : type;
            popups.card.onUpdate();
        }

        localElms.info.innerHTML = `
            <div class="header">
                <h2><rarity rarity="${rarity}"></rarity> ${data.name}</h2>
                <small>${state ? `
                    ${data.faction
                        ? `(${data.faction} faction)<br>`
                        : ``
                    }
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
                ${verbify(format.effect(data.desc, curFx, newFx))}
            </div>
            <div class="quote">
                “${verbify(data.quote)}“
            </div>
        `

        if (mode == "upgrade") {
            localElms.actions.innerHTML = "";

            if (!data.levelCost) {
                localElms.actions.insertAdjacentHTML("beforeend", `
                    <div class="formula" style="padding-inline: 10px">
                        <h4>Upgrade</h4>
                    </div>
                    <div class="actions popup-upg-actions">
                        <button class="popup-upg-main-action" disabled>Can't upgrade</button>
                    </div>
                `);
            } else if (data.maxLevel && state.level >= data.maxLevel) {
                localElms.actions.insertAdjacentHTML("beforeend", `
                    <div class="formula" style="padding-inline: 10px">
                        <h4>Upgrade</h4>
                    </div>
                    <div class="actions popup-upg-actions">
                        <button class="popup-upg-main-action" disabled>Max level reached</button>
                    </div>
                `);
            } else {
                let levelCost = getCardLevelCost(pack, rarity, id);
                let name = currencies[levelCost[1]].name;
                let canBuy = game.res[levelCost[1]] >= levelCost[0];
                localElms.actions.insertAdjacentHTML("beforeend", `
                    <div class="formula" style="padding-inline: 10px">
                        <h4>Upgrade cost:</h4>
                        <div><span>${name}</span>${_number(format(game.res[levelCost[1]]) + " / " + format(levelCost[0]))}</div>
                    </div>
                    <div class="actions popup-upg-actions"></div>
                `);
                let actions = localElms.actions.querySelector(".popup-upg-actions:last-child");
                let upBtn = $make("button.popup-upg-main-action", canBuy ? "Upgrade" : "Can't upgrade");
                if (canBuy) upBtn.classList.add("value");
                else upBtn.disabled = true;
                upBtn.onclick = () => levelUpCard(pack, rarity, id);
                actions.append(upBtn);
                let viewBtn = $make("button");
                viewBtn.innerHTML = _icon(viewType == "level-up" ? "tabler:eye-filled" : "tabler:eye");
                viewBtn.onclick = () => setViewType("level-up");
                actions.append(viewBtn);
            }
            
            if (data.crown) {
                localElms.actions.insertAdjacentHTML("beforeend", `
                    <div class="formula" style="padding-inline: 10px">
                        <h4>Fusion</h4>
                    </div>
                    <div class="actions popup-upg-actions">
                        <button class="popup-upg-main-action" disabled>Can't fuse</button>
                    </div>
                `);
            } else if (state.stars >= 5) {
                localElms.actions.insertAdjacentHTML("beforeend", `
                    <div class="formula" style="padding-inline: 10px">
                        <h4>Fusion</h4>
                    </div>
                    <div class="actions popup-upg-actions">
                        <button class="popup-upg-main-action" disabled>Max star reached</button>
                    </div>
                `);
            } else {
                let starCost = getCardStarCost(pack, rarity, id);
                let canBuy = state.amount >= starCost;
                localElms.actions.insertAdjacentHTML("beforeend", `
                    <div class="formula" style="padding-inline: 10px">
                        <h4>Fusion cost:</h4>
                        <div><span>"${data.name}" extra copies</span>${_number(format(state.amount) + " / " + format(starCost))}</div>
                    </div>
                    <div class="actions popup-upg-actions"></div>
                `);
                let actions = localElms.actions.querySelector(".popup-upg-actions:last-child");
                let upBtn = $make("button.popup-upg-main-action", canBuy ? "Fuse" : "Can't fuse");
                if (canBuy) upBtn.classList.add("value");
                else upBtn.disabled = true;
                upBtn.onclick = () => starUpCard(pack, rarity, id);
                actions.append(upBtn);
                let viewBtn = $make("button");
                viewBtn.innerHTML = _icon(viewType == "star-up" ? "tabler:eye-filled" : "tabler:eye");
                viewBtn.onclick = () => setViewType("star-up");
                actions.append(viewBtn);
            }
        } else if (mode == "purchase") {
            let buyCost = data.buyCost;
            let name = currencies[buyCost[1]].name;
            let canBuy = game.res[buyCost[1]] >= buyCost[0];
            localElms.actions.insertAdjacentHTML("beforeend", `
                <div class="formula" style="padding-inline: 10px">
                    <h4>Purchase cost:</h4>
                    <div><span>${name}</span>${_number(format(game.res[buyCost[1]]) + " / " + format(buyCost[0]))}</div>
                </div>
                <div class="actions popup-upg-actions"></div>
            `);
            let actions = localElms.actions.querySelector(".popup-upg-actions:last-child");
            let upBtn = $make("button.popup-upg-main-action", canBuy ? "Purchase" : "Can't purchase");
            if (canBuy) upBtn.classList.add("value");
            else upBtn.disabled = true;
            upBtn.onclick = () => { buyCard(pack, rarity, id); popups.card.state.popup.close(); }
            actions.append(upBtn);
        }
    },
    onClose() {
        this.state = {};
        this.elms = {};
        removeEvent("card-update", this.onUpdate);
    }
}