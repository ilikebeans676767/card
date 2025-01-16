tabs.collection = {
    name: "Collection",
    icon: "tabler:stack-2",

    cards: {},
    elms: {},

    onInit() {
        let list = this.elms.list = $make("div.card-list");
        elms.tab.append(list);

        this.updateCards();
        addEvent("card-update", this.onCardUpdate);
    },
    onDestroy() {
        this.cards = {};
        this.elms = {};
        removeEvent("card-update", this.onCardUpdate);
    },
    onFrame() {
    },

    updateCards() {
        let cardList = [];
        let pack = "standard";
        if (game.cards[pack]) for (let rarity in cards[pack]) for (let id in cards[pack][rarity]) {
            if (game.cards[pack][rarity]?.[id]) cardList.push([pack, rarity, id]);
        }

        let shouldAppend = false;
        let index = 0;
        for (let card of cardList) {
            let [pack, rarity, id] = card;
            let listId = pack + " " + rarity + " " + id;
            let div = this.cards[listId] || this.makeCard(pack, rarity, id);
            div.update();
            if (this.elms.list.children[index] != div) shouldAppend = true;
            if (shouldAppend) this.elms.list.append(div);
            index++;
        }
    },
    makeCard(pack, rarity, id) {
        let listId = pack + " " + rarity + " " + id;

        let div = $make("div.card-block");
        
        let card = div.$card = createCardUI(pack, rarity, id);
        registerTooltip(card, tooltipTemplates.card(pack, rarity, id));
        card.onclick = () => { if (prefersNoTooltips()) callPopup("card", pack, rarity, id, "upgrade"); }
        div.append(card);

        let actions = $make("div.card-action");
        div.append(actions);
        
        let levelBtn = div.$levelBtn = $make("button");
        levelBtn.onclick = () => levelUpCard(pack, rarity, id);
        registerTooltip(levelBtn, tooltipTemplates.card(pack, rarity, id, "level-up"))
        actions.append(levelBtn);
        
        let starBtn = div.$levelBtn = $make("button");
        starBtn.onclick = () => starUpCard(pack, rarity, id);
        registerTooltip(starBtn, tooltipTemplates.card(pack, rarity, id, "star-up"))
        actions.append(starBtn);
        
        div.update = () => {
            card.update();
            let data = cards[pack][rarity][id];
            let state = game.cards[pack]?.[rarity]?.[id];
            
            let levelText = "";
            if (!data.levelCost) {
                levelBtn.setAttribute("state", "off");
                levelBtn.disabled = true;
                levelText = $icon("tabler:minus");
            } else if (data.maxLevel && state.level >= data.maxLevel) {
                levelBtn.setAttribute("state", "max");
                levelBtn.disabled = true;
                levelText = $icon("tabler:check");
            } else {
                levelBtn.removeAttribute("state");
                let levelCost = getCardLevelCost(pack, rarity, id);
                levelBtn.style.setProperty("--progress", game.res[levelCost[1]] / levelCost[0]);
                let canLevelUp = game.res[levelCost[1]] >= levelCost[0];
                levelBtn.disabled = !canLevelUp;
                levelText = $icon("tabler:arrow-big-up");
            }
            if (levelBtn.innerHTML != levelText) levelBtn.innerHTML = levelText;
            
            let starText = "";
            if (data.crown) {
                starBtn.setAttribute("state", "off");
                starBtn.disabled = true;
                starText = $icon("tabler:minus");
            } else if (state.stars >= 5) {
                starBtn.setAttribute("state", "max");
                starBtn.disabled = true;
                starText = $icon("tabler:check");
            } else {
                starBtn.removeAttribute("state");
                let starCost = getCardStarCost(pack, rarity, id);
                starBtn.style.setProperty("--progress", state.amount / starCost);
                let canStarUp = state.amount >= starCost;
                starBtn.disabled = !canStarUp;
                starText = $icon("tabler:star");
            }
            if (starBtn.innerHTML != starText) starBtn.innerHTML = starText;
        }

        this.cards[listId] = div;

        return div;
    },
    onCardUpdate() {
        tabs.collection.updateCards();
    }
}