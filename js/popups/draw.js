popups.draw = {
    state: {},
    elms: {},
    call(loot) {
        let popup = makePopup();
        popup.classList.add("clear", "draw-popup");
        popup.onpointerdown = () => {
            if (this.state.phase == "breaking") {
                this.state.timer -= effects.breakSkip;
            } else if (this.state.phase == "revealing") {
                this.state.timer = effects.revealTime * (1 - effects.revealSkip);
            }
        }

        this.state = {
            loot,
            phase: "breaking",
            timer: effects.breakTime,
            index: 0,
        };
        this.elms = {};

        let bigCard = this.elms.bigCard = $make("div");
        bigCard.classList.add("big-card");
        popup.$body.append(bigCard);

        let list = this.elms.list = $make("div");
        list.classList.add("card-list");
        popup.$body.append(list);

        let result = this.elms.result = $make("div");
        result.classList.add("draw-result");
        popup.$body.append(result);

        let resultCur = $make("div");
        resultCur.classList.add("draw-result-currencies");
        for (let res of loot.res) {
            let div = createCurrencyUI(currencies[res[0]]);
            div.$amount.textContent = format(res[1]);
            resultCur.append(div);
        }
        result.append(resultCur);


        let close = $make("button", "Continue");
        close.classList.add("primary", "thick");
        close.onclick = () => popup.close();
        result.append(close);
        

        addEvent("frame", this.onFrame);
        return popup;
    },
    onFrame() {
        let state = popups.draw.state;
        let localElms = popups.draw.elms;

        state.timer -= delta / 1000;
        if (state.phase == "breaking") {
            if (state.timer <= 0) {
                localElms.bigCard.classList.add("broken");
                state.phase = "revealing";
                state.timer = effects.revealTime;
            }
            if (effects.breakTime - state.timer > .1) localElms.bigCard.style.setProperty("--timer", 1 - state.timer / effects.breakTime);
            localElms.bigCard.style.setProperty("--rotate", Math.random() * 10 - 5 + "deg");
            localElms.bigCard.style.setProperty("--shake", (Math.random() * 20 - 10) + "px, " + (Math.random() * 20 - 10) + "px");
        } else if (state.phase == "revealing") {
            while (state.timer <= 0) {
                if (state.index >= state.loot.cards.length) {
                    popups.draw.onDone();
                    localElms.list.classList.add("done");
                    if (localElms.list.scrollHeight > localElms.list.clientHeight) localElms.list.style.setProperty("--padding", localElms.result.scrollHeight + "px");
                    localElms.result.style.setProperty("--height", localElms.list.scrollHeight + localElms.result.scrollHeight * 2 + "px");
                    state.phase = "done";
                    removeEvent("frame", popups.draw.onFrame);
                    break;
                } else {
                    let [pack, rarity, id, count] = state.loot.cards[state.index];
                    let card = createCardUI(pack, rarity, id);
                    card.classList.add("anim-float-in");
                    localElms.list.append(card);
                    localElms.list.scrollTo({ top: localElms.list.scrollHeight, behavior: 'smooth' });
                    state.index++;
                    state.timer += effects.revealTime;
                }
            }
        }
    },
    onDone() {
        let loot = popups.draw.state.loot;
        for (let res of loot.res) {
            game.res[res[0]] += res[1];
        }
        for (let card of loot.cards) {
            game.stats.cardsDrawn += card[3];
            addCard(...card);
        }

        game.time.drawCooldown = 1;
        emit("card-update");
        updateEffects();
        saveGame();
    },
    onClose() {
        this.state = {};
        this.elms = {};
        removeEvent("frame", this.onFrame);
    }
}