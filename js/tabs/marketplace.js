tabs.marketplace = {
    name: "Marketplace",
    icon: "mdi:shop-outline",

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
        let pack = "standard", rarity = "ex";
        for (let id in cards[pack][rarity]) {
            let data = cards[pack][rarity][id];
            if (!hasCard(pack, rarity, id) && (!data.condition || data.condition())) cardList.push([pack, rarity, id]);
        }

        for (let card of cardList) {
            let [pack, rarity, id] = card;
            let listId = pack + " " + rarity + " " + id;
            let div = this.cards[listId] || this.makeCard(pack, rarity, id);
            div.update();
            this.elms.list.append(div);
        }
    },
    makeCard(pack, rarity, id) {
        let listId = pack + " " + rarity + " " + id;

        let div = $make("div.card-block");
        
        let card = div.$card = createCardUI(pack, rarity, id);
        registerTooltip(card, tooltipTemplates.card(pack, rarity, id))
        div.append(card);
        
        let actions = $make("div.card-action");
        div.append(actions);
        
        let buyBtn = div.$levelBtn = $make("button");
        buyBtn.onclick = () => buyCard(pack, rarity, id);
        registerTooltip(buyBtn, tooltipTemplates.card(pack, rarity, id, "buy"))
        actions.append(buyBtn);
        
        div.update = () => {
            card.update();
            let data = cards[pack][rarity][id];
            
            let canBuy = game.res[data.buyCost[1]] >= data.buyCost[0];
            buyBtn.disabled = !canBuy;
            levelText = $icon("tabler:shopping-cart");

            if (buyBtn.innerHTML != levelText) buyBtn.innerHTML = levelText;
            
        }

        this.cards[listId] = div;

        return div;
    },
    onCardUpdate() {
        tabs.marketplace.updateCards();
    }
}