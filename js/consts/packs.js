const packs = {
    standard: {
        legacy: {
            cost: [9.99, "money"],
            condition: () => !game.flags.boughtPacks.standard?.legacy,
            onBuy() {
                let cards = [
                    ["standard_legacy", "ex", "legacy"],
                    ["standard_legacy", "ex", "zip"],
                    ["standard_legacy", "ex", "pickit"],
                    ["standard_legacy", "ex", "ads"],
                ].map(([pack, rarity, id]) => [pack, rarity, id, 1, true])
                callPopup("draw", { res: [], cards});
            },
            effects: [],
        },
        starter: {
            cost: [2.99, "money"],
            condition: () => game.stats.accountsSold >= 2 && !hasCard("standard", "ex", "offline")
                && !hasCard("standard", "ex", "pickit") && !hasCard("standard", "ex", "shred"),
            onBuy() {
                let cards = [
                    ["standard", "ex", "offline"],
                    ["standard", "ex", "pickit"],
                    ["standard", "ex", "shred"],
                ].map(([pack, rarity, id]) => [pack, rarity, id, 1, true])
                callPopup("draw", {cards, res: [
                    ["points", 1e6],
                    ["shreds", 1e3],
                ]});
            },
            effects: [1e6, 1e3],
        }
    }
}