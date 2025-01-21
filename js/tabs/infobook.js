tabs.infobook = {
    name: "Infobook",
    icon: "mdi:notebook-outline",

    subtab: "stats",
    state: {},
    items: {},
    elms: {},

    onInit() {
        let holder = $make("div.infobook-holder");
        elms.tab.append(holder);

        let tabButtons = createChoiceGroup({
            stats: [$icon("tabler:chart-bar"), " Statistics"],
            // breakdown: [$icon("uil:apps"), " Breakdown"],
            gallery: [$icon("tabler:slideshow"), " Gallery"],
        }, this.subtab, (x) => {
            this.subtab = x;
            this.updateSubtab();
        });
        tabButtons.className = "tab-buttons";
        holder.append(tabButtons);

        let cards = this.elms.cards = $make("div.infobook-cards");
        holder.append(cards);

        this.updateSubtab();
        addEvent("frame", this.onFrame);
        addEvent("effect-update", this.updateItems);
    },
    onDestroy() {
        this.clearItems();
        this.elms = {};
        this.items = {};
        this.state = {};
        removeEvent("frame", this.onFrame);
        removeEvent("effect-update", this.updateItems);
    },
    onFrame() {
        let localElms = tabs.infobook.elms;
        let state = tabs.infobook.state;
        let viewWidth = localElms.cards.clientWidth;
        if (state.viewWidth != viewWidth) {
            state.viewWidth = viewWidth;
            let viewStyle = getComputedStyle(localElms.cards);
            viewWidth -= parseFloat(viewStyle.paddingLeft) + parseFloat(viewStyle.paddingRight);
            let gap = parseFloat(viewStyle.gap);
            let cols = Math.floor((viewWidth + gap) / 300);
            let width = (viewWidth - gap * (cols - 1)) / cols;
            console.log(gap, cols, width);
            localElms.cards.style.setProperty("--item-width", width + "px");
        }
    },
    updateSubtab() {
        this.clearItems();
        this.elms.cards.innerText = "";
        if (this.subtab == "stats") {
            for (let group in statEntries) {
                let card = this.makeCard(group, statEntries[group]);
                this.elms.cards.append(card);
                for (let id in statEntries[group].items) {
                    card.$content.append(this.makeItem(group, id, statEntries[group].items[id]));
                }
            }
        } else if (this.subtab == "gallery") {
            this.elms.cards.append($make("div.infobook-card",
                $make("h3.header", "Coming soon..."),
                $make("div.content", "Maybe I'll add lore to the game..."),
            ))
        }
    },

    clearItems() {
        for (let event in this.items) if (event) {
            for (let fn of this.items[event]) {
                removeEvent(event, fn);
            }
        }
        this.items = {};
    },
    updateItems() {
        for (let event in tabs.infobook.items) {
            for (let fn of tabs.infobook.items[event]) {
                fn();
            }
        }
    },
    makeCard(group, item) {
        let div = $make("div.infobook-card.stat-card",
            $make("h3.header", item.name),
        );
        div.append(div.$content = $make("div.content"));

        if (item.condition) {
            let update = () => {
                elm.style.display = item.condition() ? "" : "none";
            }

            if (item.event) addEvent(item.event, update);
            if (!this.items[item.event]) this.items[item.event] = [];
            this.items[item.event].push(update);
            update();
        }

        return div;
    },
    makeItem(group, id, item) {
        let elm, update = null;
        if (item.separator) {
            elm = $make("hr");

            if (item.condition) update = () => {
                elm.style.display = item.condition() ? "" : "none";
            }
        } else {
            let content, lock, lockReq;
            elm = $make("div.stat-entry",
                $makeHTML("span", item.name),
                content = $make("span.value"),
                lock = $make("button", 
                    $icon("tabler:lock"), " ",
                    lockReq = $make("span")
                )
            );
    
            lock.onclick = () => buyStatEntry(group, id);
    
            update = () => {
                if (item.condition) {
                    if ((elm.style.display = item.condition() ? "" : "none") == none) return;
                }
                if (game.flags.statUnlocks[group]?.[id]) {
                    lock.style.display = "none";
                    content.innerHTML = item.display();
                } else {
                    lock.style.display = "";
                    lockReq.innerHTML = _number(format(item.cost[0])) + " " + currencies[item.cost[1]].name;
                    lock.style.setProperty("--progress", game.res[item.cost[1]] / item.cost[0])
                    lock.disabled = game.res[item.cost[1]] < item.cost[0];
                }
            }
        }

        if (update) {
            if (item.event) addEvent(item.event, update);
            if (!this.items[item.event]) this.items[item.event] = [];
            this.items[item.event].push(update);
            update();
        }
        return elm;
    }
}