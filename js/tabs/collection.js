tabs.collection = {
    name: "Collection",
    icon: "tabler:stack-2",

    cards: {},
    elms: {},

    onInit() {
        let list = this.elms.list = $make("div");
        list.classList.add("card-list");
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
        if (game.cards[pack]) for (let rarity in game.cards[pack]) for (let id in game.cards[pack][rarity]) {
            cardList.push([pack, rarity, id]);
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

        let div = $make("div");
        div.classList.add("card-block");
        
        let card = div.$card = createCardUI(pack, rarity, id);
        registerTooltip(card, tooltipTemplates.card(pack, rarity, id))
        div.append(card);
        
        div.update = () => {
            card.update();
        }

        this.cards[listId] = div;

        return div;
    },
    onCardUpdate() {
        tabs.collection.updateCards();
    }
}