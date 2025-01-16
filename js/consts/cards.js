const cards = {
    standard: {
        n: {
            "n0": {
                name: "The Nothing Square",
                desc: "No effect.",
                quote: "That one square that is programmed to be picked 99% of the time",
                maxLevel: 0,
                effects: [],
                effectors: {}
            },
            "n1": {
                name: "A Single Point",
                desc: "Gain {+0} points per draw.",
                quote: "ここにいる",
                levelCost: [10, 1.2],
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    points: [priority.additive, (x) => x + fx(0)]
                }
            },
            "n2": {
                name: "Half A Point",
                desc: "Randomly gain zero to {+0} points per draw.",
                quote: "To explain what half a point even is, we'll need to talk about parallel universes-",
                condition: () => hasCard("standard", "n", "n1"),
                levelCost: [5, 1.15],
                starDiff: 0.2,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    pointsExtra: [priority.additive, (x) => x + fx(0)]
                }
            },
            "n3": {
                name: "Card Pack",
                desc: "{+0} bulk draw. Bulk draw allows you to use multiple draws at once.",
                quote: "Well, if you want to use up all of those one trillion card draws you'll need to start drawing multiple of them at once, you know?",
                levelCost: [10, 1.3],
                starDiff: 0.8,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    bulk: [priority.additive, (x) => x + fx(0)]
                }
            },
            "n4": {
                name: "Self-Filling Pack",
                desc: "{+0} bulk power. Bulk power generates bulk energy which acts as a temporary bulk draw increase that is spent upon drawing.",
                quote: "Incremental games, also known as idle games",
                condition: () => hasCard("standard", "n", "n3"),
                levelCost: [25, 2],
                starDiff: 1.6,
                effects: [
                    (level, star) => level * star * 5,
                ],
                effectors: {
                    bulkPower: [priority.additive, (x) => x + fx(0)]
                }
            },
            "n5": {
                name: "Bigger Wrap",
                desc: "{+0} bulk energy cap. Bulk energy production past the energy cap are slowed down.",
                quote: "You can idle for real this time",
                condition: () => hasCard("standard", "n", "n4"),
                levelCost: [100, 1.8],
                starDiff: 1.4,
                effects: [
                    (level, star) => level * star * 10,
                ],
                effectors: {
                    energyCap: [priority.additive, (x) => x + fx(0)]
                }
            },
            "n6": {
                name: "Scissors",
                desc: "{+0%} pack breaking speed.",
                quote: "If you haven't noticed it yet, you can click the pack while it's breaking to break it faster",
                levelCost: [25, 2],
                starDiff: 0.5,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    breakTime: [priority.multiplicative, (x) => x / (1 + fx(0) / 100)]
                }
            },
            "n7": {
                name: "Fast Delivery",
                desc: "{+0%} cooldown speed.",
                quote: "Restock faster with our new fast delivery service—applied to all orders 1 card and above!",
                levelCost: [25, 2],
                starDiff: 0.5,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    cooldownTime: [priority.multiplicative, (x) => x / (1 + fx(0) / 100)]
                }
            },
            "c1": {
                name: "In-Game Shop",
                desc: "Unlock the Marketplace.",
                quote: "Find cards that can't be found from drawing, and probably spend all of your money trying to out-bid the highest bidder",
                condition: () => hasCard("standard", "n", "n5"),
                crown: true,
                effects: [],
                effectors: {}
            },
        },
        r: {
            "n0": {
                name: "Epic Shredding Machine",
                desc: "{+0%} shred multiplier.",
                quote: "Instead of using a small office-made shredder, why not use the giant ones made for ASMR videos on the internet?",
                condition: () => flags.unlocked.shreds,
                levelCost: [100000, 1.2],
                starDiff: 0.2,
                effects: [
                    (level, star) => level * star * 20,
                ],
                effectors: {
                    shredMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
            "n0b": {
                name: "Amazing Shredding Moments",
                desc: "{+0%} shred multiplier.",
                quote: "Apparently people on the internet love watching things being shredded to pieces!"
                    + " You figure out you could record your Epic Shredding Machines shredding cards and upload it to PipeTube to earn some sweet, sweet ad revenue in the process",
                condition: () => hasCard("standard", "r", "n0"),
                levelCost: [2500, 1.25, "shreds"],
                starDiff: 0.3,
                effects: [
                    (level, star) => level * star * 20,
                ],
                effectors: {
                    shredMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
            "n1": {
                name: "Point Multiplier",
                desc: "{+0%} point multiplier.",
                quote: "Every incremental game needs exponential growth, a generic currency needs a generic multiplier upgrade",
                levelCost: [100000, 1.3],
                effects: [
                    (level, star) => 40 + level * [0, 10, 20, 40, 80, 160][star],
                ],
                effectors: {
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
            "n1b": {
                name: "Money Press",
                desc: "{+0%} point multiplier.",
                quote: "Press some of your shreds into money. This is precisely how legal money are made too, people won't even be able to notice a difference",
                condition: () => flags.unlocked.shreds,
                levelCost: [1000, 1.12, "shreds"],
                starDiff: 0.2,
                effects: [
                    (level, star) => 25 + level ** (0.9 + star * 0.1) * [0, 25, 50, 100, 180, 250][star],
                ],
                effectors: {
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
            "n2": {
                name: "Bulkier Card Packs",
                desc: "{+0%} bulk draw, but {+1%} cooldown duration.",
                quote: "The bulkier, the better",
                condition: () => hasCard("standard", "n", "n3") && hasCard("standard", "ex", "zip"),
                levelCost: [200000, 2],
                starDiff: 0.9,
                effects: [
                    (level, star) => 20 + level * [0, 5, 10, 16, 25, 40][star],
                    (level, star) => 2 * level,
                ],
                effectors: {
                    bulk: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    cooldownTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
            "n3": {
                name: "Card Opener Factory",
                desc: "{+0%} energy gain, but {+1%} cooldown duration.",
                quote: "Produces large quantity of card openers",
                condition: () => hasCard("standard", "n", "n4") && hasCard("standard", "ex", "zip"),
                levelCost: [250000, 1.8],
                starDiff: 0.8,
                effects: [
                    (level, star) => 20 + level * [0, 5, 10, 16, 25, 40][star],
                    (level, star) => 2 * level,
                ],
                effectors: {
                    bulkPower: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    cooldownTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
            "n3b": {
                name: "Recycling",
                desc: "{+0%} energy gain.",
                quote: "Reusing cards to open more cards is a good idea actually",
                condition: () => hasCard("standard", "r", "n3") && flags.unlocked.shreds,
                levelCost: [1000, 1.25, "shreds"],
                maxLevel: 40,
                starDiff: 1.2,
                effects: [
                    (level, star) => 10 * level * star,
                ],
                effectors: {
                    bulkPower: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n3c": {
                name: "Composter",
                desc: "{+0%} bulk energy cap.",
                quote: "Recycle even harder with this composter designed to make a metric-scrap-ton of cards",
                condition: () => hasCard("standard", "r", "n3b"),
                levelCost: [1000, 1.2, "shreds"],
                maxLevel: 75,
                starDiff: 0.9,
                effects: [
                    (level, star) => 25 * (level + 1) * [0, 1, 2, 3, 5, 8, 13][star],
                ],
                effectors: {
                    energyCap: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n4": {
                name: "Endurance Training",
                desc: "{+0%} card multiplier, but {+1%} cooldown duration and pack breaking duration.",
                quote: "The card packs got some endurance training! Now they are harder to break into, but the contents are increased!",
                condition: () => hasCard("standard", "ex", "zip"),
                levelCost: [50000, 2],
                starDiff: 1,
                effects: [
                    (level, star) => 8 + level * [0, 2, 4, 7, 12, 20][star],
                    (level, star) => 5 * level,
                ],
                effectors: {
                    bulkMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    cooldownTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                    breakTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
        },
        sr: {
            "n1": {
                name: "Perfectly Generic Card",
                desc: "{+0%} point multiplier.",
                quote: "A perfectly generic card that boosts the perfectly generic currency, the genericness is getting too perfect to handle",
                levelCost: [125, 5],
                effects: [
                    (level, star) => 40 + level ** (0.9 + star * 0.1) * [0, 10, 20, 40, 80, 160][star],
                ],
                effectors: {
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
        },
        ex: {
            "zip": {
                name: "StackRAR",
                desc: "Group together duplicate cards in the draw view, though the compression halves your card revealing speed in the process. Also remove the <span class='number'>100</span> bulk draw limit.",
                quote: "Please note that StackRAR is not a free card. After a 40 day trial period you must either buy a license or burn this card off of your collection",
                crown: true,
                buyCost: [15000, "points"],
                effects: [],
                effectors: {
                    revealTime: [priority.multiplicative, (x) => x * 2]
                }
            },
            "shred": {
                name: "Shredder",
                desc: "Duplicate cards that are useless are shredded into a new currency called Shreds, including crowned cards and cards with max stars.",
                quote: "Act as if nothing has ever happened",
                condition: () => game.cards.standard?.r,
                crown: true,
                buyCost: [2500000, "points"],
                effects: [],
                effectors: {}
            },
        }
    }
}

const cardStarCost = {
    standard: {
        n: (x, n = 0) => Math.floor((20 + 5 * x) * (x + n) ** (x + 1)),
        r: (x, n = 0) => Math.floor((10 + 5 * x) * (x + n) ** (x + 0.5)),
        sr: (x, n = 0) => Math.floor((5 + 5 * x) * (x + n) ** (x)),
    }
}