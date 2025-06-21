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
            }
        }
    }
}