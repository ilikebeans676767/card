const MAX_CARDS = 1e12;

function onFrame() {
    elms.currencies.$cards.$title.textContent = "Cards left";
    elms.currencies.$cards.$amount.textContent = format(MAX_CARDS - game.stats.cardsDrawn, 0, 13);
    elms.currencies.$points.$amount.textContent = format(game.res.points, 0, 9);

    game.res.energy += delta / 60000 * effects.bulkPower;
    game.time.drawCooldown -= delta / 1000 / effects.cooldownTime;
    let cooldown = getDrawCooldown();
    elms.draw.classList.toggle("anim-card-btn-draw", !!popups.draw.elms.list);
    if (popups.draw.elms.list) {
        elms.draw.$action.textContent = "";
        elms.draw.$amount.textContent = "";
    } else if (cooldown > 0) {
        elms.draw.$action.textContent = "In cooldown";
        elms.draw.$amount.textContent = format(cooldown, 2) + "s";
    } else {
        elms.draw.$action.textContent = "Draw";
        elms.draw.$amount.textContent = "×" + format(getDrawAmount(), 0, 9);
    }

    tabs[currentTab]?.onFrame?.();
    emit("frame");
}

// ----- Effect logic

let effects = {...baseEffect};
let cardEffects = {};
let fx = (x) => x;

function updateEffects() {
    for (let eff in baseEffect) effects[eff] = baseEffect[eff];

    let effectors = {};
    function addEffector(type, priority, target, effector, data) {
        if (!effectors[priority]) effectors[priority] = [];
        effectors[priority].push([type, target, effector, data]);
    }
    cardEffects = {};
    let getCardEffectFx = (pack, rarity, id) => {
        return (x) => cardEffects[pack]?.[rarity]?.[id]?.[x] ?? 0;
    }

    for (let pack in game.cards) {
        cardEffects[pack] = {};
        for (let rarity in game.cards[pack]) {
            cardEffects[pack][rarity] = {};
            for (let id in game.cards[pack][rarity]) {
                let data = cards[pack][rarity][id];
                let state = game.cards[pack][rarity][id];
                let list = cardEffects[pack][rarity][id] = [];
                fx = getCardEffectFx(pack, rarity, id);

                for (let effect of data.effects) list.push(effect(state.level, state.stars));
                for (let eftr in data.effectors) addEffector("card", 
                    data.effectors[eftr][0], eftr, data.effectors[eftr][1], [pack, rarity, id]
                );
            }
        }
    }

    let sortedEffectorPriorities = Object.keys(effectors).sort((a, b) => a - b);
    for (let eId of sortedEffectorPriorities) {
        for (let eftr of effectors[eId]) {
            if (eftr[0] == "card") fx = getCardEffectFx(...eftr[3]);
            effects[eftr[1]] = eftr[2](effects[eftr[1]]);
        }
    }
}

// ----- Card logic

function addCard(pack, rarity, id, amount) {
    if (!game.cards[pack]) game.cards[pack] = {};
    if (!game.cards[pack][rarity]) game.cards[pack][rarity] = {};
    if (!game.cards[pack][rarity][id]) game.cards[pack][rarity][id] = {
        amount: -1,
        stars: 1,
        level: 1,
    };
    game.cards[pack][rarity][id].amount += amount;
}

function hasCard(pack, rarity, id) {
    return !!game.cards[pack]?.[rarity]?.[id];
}

function makeLootTable() {
    let lootDef = [];
    lootDef.push([
        { item: "res:points", count: [
            Math.floor((effects.points) * effects.pointsMult), 
            Math.floor((effects.points + effects.pointsExtra) * effects.pointsMult)
        ] }
    ]);

    let pack = "standard";
    let cardDef = [];
    lootDef.push(cardDef);
    let rarityList = ["ur", "ssr", "sr", "r", "n"];
    let rarityChance = { n: 1, r: 1e-3, sr: 1e-5, ssr: 1e-7, ur: 1e-9 }
    let chanceSum = 0;
    for (let rarity of rarityList) {
        let cardRarityDef = [];
        for (let id in cards[pack][rarity]) {
            let card = cards[pack][rarity][id];
            if (card.condition && !card.condition()) continue;

            let cardDef = { item: `card:${pack}/${rarity}/${id}`, w: 1 };
            if (card.crown) cardDef.w /= 10;

            cardRarityDef.push(cardDef);
        }
        if (cardRarityDef.length) {
            let rlt = new lootalot.LootTable(cardRarityDef);
            cardDef.push({ table: rlt, p: rarityChance[rarity] - chanceSum })
            chanceSum = rarityChance[rarity];
        }
    }

    let lt = new lootalot.LootTable(...lootDef);
    return lt;
}

function doDraw(count) {
    let rawLoot = makeLootTable().loot(count);
    let lootList = {
        res: [],
        cards: [],
    };
    for (let loot of rawLoot) {
        let [type, target] = loot.item.split(":");
        if (type == "res") {
            if (loot.count > 0) lootList.res.push([target, loot.count]);
        } else if (type == "card") {
            let [pack, rarity, id] = target.split("/");
            if (hasCard("standard", "ex", "zip")) {
                lootList.cards.push([pack, rarity, id, loot.count]);
            } else for (let i = 0; i < loot.count; i++) {
                lootList.cards.push([pack, rarity, id, 1]);
            }
        }
    }

    lootList.cards.shuffle();
    callPopup("draw", lootList);
}

function onDrawButtonClick() {
    if (popups.draw.elms?.list) return;
    if (getDrawCooldown() > 0) return;
    let amount = getDrawAmount();
    game.res.energy -= getUsedEnergy();
    doDraw(amount);
}

function getDrawCooldown() {
    return game.time.drawCooldown * effects.cooldownTime;
}

function getDrawAmount() {
    let count = Math.floor(effects.bulk) + getUsedEnergy();
    count = Math.floor(count * effects.bulkMult);
    count = Math.min(count, MAX_CARDS - game.stats.cardsDrawn);
    return count;
}

function getUsedEnergy() {
    return Math.floor(game.res.energy);
}

function getCardLevelCost(pack, rarity, id, amount = 1) {
    let data = cards[pack][rarity][cost];
    let state = game.cards[pack]?.[rarity]?.[cost];
    if (!state || !data.levelCost) return [Infinity];
    let [base, rate, res] = data.levelCost;
    return [sumGeometricSeries(base, rate, amount, state.level - 1), res ?? "points"]
}

function getCardLevelMax(pack, rarity, id) {
    let data = cards[pack][rarity][cost];
    let state = game.cards[pack]?.[rarity]?.[cost];
    if (!state || !data.levelCost) return 0;
    let [base, rate, res] = data.levelCost;
    return maxGeometricSeries(base, rate, game.res[res], state.level - 1);
}