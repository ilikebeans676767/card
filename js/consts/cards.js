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
                    (level, star) => level ** ((game.cards.standard?.sr?.n1?.stars ?? 0) * .1 + 1) * star,
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
                    (level, star) => level ** ((game.cards.standard?.sr?.n2?.stars ?? 0) * .1 + 1) * star,
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
                desc: "{+0} bulk power. Bulk power passively generates bulk energy.",
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
                    (level, star) => 20 + level * star * 5,
                    (level, star) => 2 * level,
                ],
                effectors: {
                    bulk: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    cooldownTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
            "n3": {
                name: "Card Opener Factory",
                desc: "{+0%} bulk power, but {+1%} cooldown duration.",
                quote: "Produces large quantity of card openers",
                condition: () => hasCard("standard", "n", "n4") && hasCard("standard", "ex", "zip"),
                levelCost: [250000, 1.8],
                starDiff: 0.8,
                effects: [
                    (level, star) => 20 + level * star * 5,
                    (level, star) => 2 * level,
                ],
                effectors: {
                    bulkPower: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    cooldownTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
            "n3b": {
                name: "Recycling",
                desc: "{+0%} bulk power.",
                quote: "Reusing cards to open more cards is a good idea actually",
                condition: () => hasCard("standard", "r", "n3") && flags.unlocked.shreds,
                levelCost: [1000, 1.4, "shreds"],
                maxLevel: 40,
                starDiff: 1.2,
                effects: [
                    (level, star) => 10 * level * [0, 1, 1.5, 2, 3, 4][star],
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
                levelCost: [1000, 1.3, "shreds"],
                maxLevel: 75,
                starDiff: 0.9,
                effects: [
                    (level, star) => 25 * (level + 1) * [0, 1, 2, 3, 5, 7][star],
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
                maxLevel: 40,
                starDiff: 1,
                effects: [
                    (level, star) => 8 + level * star * 2,
                    (level, star) => 5 * level,
                ],
                effectors: {
                    bulkMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    cooldownTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                    breakTime: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
            "n5a": {
                name: "Trending",
                desc: "{+0} fire power per gain.",
                quote: "ah,<br>that's hot,<br>..., that's hot",
                faction: "fire",
                levelCost: [2, 1.5, "fire"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    fireGain: [priority.additive, (x) => x + fx(0)],
                }
            },
            "n5b": {
                name: "Ocean",
                desc: "{+0} water power per gain.",
                quote: "i'm blue da be dee da be die",
                faction: "water",
                levelCost: [2, 1.5, "water"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    waterGain: [priority.additive, (x) => x + fx(0)],
                }
            },
            "n5c": {
                name: "Forest",
                desc: "{+0} leaf power per gain.",
                quote: "team trees ftw",
                faction: "leaf",
                levelCost: [2, 1.5, "leaf"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    leafGain: [priority.additive, (x) => x + fx(0)],
                }
            },
            "n5d": {
                name: "Air",
                desc: "{+0} sun power per gain.",
                quote: "feel the breath",
                faction: "sun",
                levelCost: [2, 1.5, "sun"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    sunGain: [priority.additive, (x) => x + fx(0)],
                }
            },
            "n5e": {
                name: "Earth",
                desc: "{+0} moon power per gain.",
                quote: "it is our home",
                faction: "moon",
                levelCost: [2, 1.5, "moon"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    moonGain: [priority.additive, (x) => x + fx(0)],
                }
            },
            "c1": {
                name: "System 2",
                desc: "Unlock the Infobook. View your stats and other things, though with a price...",
                quote: "Erm ackstually 🤓",
                crown: true,
                effects: [],
                effectors: {}
            },
        },
        sr: {
            "n0": {
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
            "n1": {
                name: "A Pair of Points",
                desc: "Raise the level in <b><rarity rarity='n'></rarity> A Single Point</b>'s effect by {^0:1}",
                quote: "Two is always better than one",
                effects: [
                    (level, star) => 1 + star * 0.1,
                ],
                effectors: {}
            },
            "n2": {
                name: "Dice Extractor",
                desc: "Raise the level in <b><rarity rarity='n'></rarity> Half a Point</b>'s effect by {^0:1}",
                quote: "Let the pips on the die guide you",
                effects: [
                    (level, star) => 1 + star * 0.1,
                ],
                effectors: {}
            },
            "n3": {
                name: "Card Warehouse",
                desc: "{+0%} bulk energy cap.",
                quote: "At this rate you will need to get yourself a bigger room just so you can store all your cards",
                condition: () => hasCard("standard", "r", "n3b"),
                levelCost: [10000000, 5, "shreds"],
                maxLevel: 75,
                starDiff: 0.9,
                effects: [
                    (level, star) => 10 * level * [0, 2, 3, 5, 8, 12][star],
                ],
                effectors: {
                    energyCap: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n4a": {
                name: "Fire Power Mastery",
                desc: "{+0%} fire power, leaf power, and point gains.",
                quote: "Yes, these <rarity rarity='sr'></rarity> cards really are just copy and paste, you don't think every gacha game does this all the time?",
                faction: "fire",
                levelCost: [10, 1.2, "fire"],
                effects: [
                    (level, star) => 8 + level * [0, 2, 3, 5, 8, 12][star],
                ],
                effectors: {
                    fireGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    leafGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n4b": {
                name: "Water Power Mastery",
                desc: "{+0%} water power, fire power, and point gains.",
                quote: "Yes, these <rarity rarity='sr'></rarity> cards really are just copy and paste, you don't think every gacha game does this all the time?",
                faction: "water",
                levelCost: [10, 1.2, "water"],
                effects: [
                    (level, star) => 8 + level * [0, 2, 3, 5, 8, 12][star],
                ],
                effectors: {
                    fireGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    waterGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n4c": {
                name: "Leaf Power Mastery",
                desc: "{+0%} leaf power, water power, and point gains.",
                quote: "Yes, these <rarity rarity='sr'></rarity> cards really are just copy and paste, you don't think every gacha game does this all the time?",
                faction: "leaf",
                levelCost: [10, 1.2, "leaf"],
                effects: [
                    (level, star) => 8 + level * [0, 2, 3, 5, 8, 12][star],
                ],
                effectors: {
                    leafGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    waterGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n4d": {
                name: "Sun Power Mastery",
                desc: "{+0%} sun power, moon power, and point gains.",
                quote: "Yes, these <rarity rarity='sr'></rarity> cards really are just copy and paste, you don't think every gacha game does this all the time?",
                faction: "sun",
                levelCost: [10, 1.2, "sun"],
                effects: [
                    (level, star) => 8 + level * [0, 2, 3, 5, 8, 12][star],
                ],
                effectors: {
                    sunGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    moonGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n4e": {
                name: "Moon Power Mastery",
                desc: "{+0%} moon power, sun power, and point gains.",
                quote: "Yes, these <rarity rarity='sr'></rarity> cards really are just copy and paste, you don't think every gacha game does this all the time?",
                faction: "moon",
                levelCost: [10, 1.2, "moon"],
                effects: [
                    (level, star) => 8 + level * [0, 2, 3, 5, 8, 12][star],
                ],
                effectors: {
                    sunGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    moonGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
        },
        ssr: {
            "n0": {
                name: "Homestretch",
                desc: "{+0%} card multiplier.",
                quote: "Thank you for going this far into the game! If you like it be sure to leave a like and subscribe for more content like this",
                levelCost: [1e9, 10],
                starDiff: 1,
                effects: [
                    (level, star) => level * [0, 1.2, 1.5, 1.8, 2.2, 2.6][star],
                ],
                effectors: {
                    bulkMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
            "n0b": {
                name: "Scrap",
                desc: "{x0} Shred gain from <rarity rarity='r'></rarity> and above cards.",
                quote: "quack",
                faction: "water",
                condition: () => flags.unlocked.shreds,
                levelCost: [1e6, 5, "shreds"],
                starDiff: 1,
                effects: [
                    (level, star) => level * star * 2,
                ],
                effectors: {
                    shredRMult: [priority.multiplicative, (x) => x * fx(0)]
                }
            },
            "n0c": {
                name: "Pyrite",
                desc: "{x0} Shred gain from <rarity rarity='sr'></rarity> and above cards.",
                quote: "Despite it's being \"fool's gold\", it can still be used as an ingredient for the <rarity rarity='sr'></rarity> cards",
                faction: "fire",
                condition: () => flags.unlocked.shreds,
                levelCost: [1e9, 10, "shreds"],
                starDiff: 1,
                effects: [
                    (level, star) => level * star * 2,
                ],
                effectors: {
                    shredSRMult: [priority.multiplicative, (x) => x * fx(0)]
                }
            },
            "n1a": {
                name: "Galaxy",
                desc: 
                    "Gain more Points based on the total amount of stars you have in your card collection (crowned cards count as {0} stars each)."
                    + "<br>(Currently: {1} stars ⇒ {+2%} point gain)",
                quote: "In a galaxy, far, far away...",
                faction: "sun",
                starDiff: 0.6,
                effects: [
                    (level, star) => 1 + star * 2,
                    (level, star) => { let count = getTotalStars("standard"); return count.stars + count.crowns * fx(0); },
                    (level, star) => fx(1) ** (star * .1 + .9),
                ],
                effectors: {
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(2) / 100)]
                }
            },
            "n1b": {
                name: "Royal Junk",
                desc: 
                    "Gain more Shreds based on the total amount of crowned cards you have in your collection."
                    + "<br>(Currently: {0} crowned cards ⇒ {+1%} shred gain)",
                quote: "More valuable than regular junk",
                condition: () => flags.unlocked.shreds,
                starDiff: 0.5,
                effects: [
                    (level, star) => { let count = getTotalStars("standard"); return count.crowns; },
                    (level, star) => fx(0) ** (star * .2 + 1) * 15,
                ],
                effectors: {
                    shredMult: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)]
                }
            },
            "n1c": {
                name: "Extra Points",
                desc: 
                    "Gain more Points based on the total amount of <rarity rarity='ex'></rarity> cards you have in your collection."
                    + "<br>(Currently: {0} <rarity rarity='ex'></rarity> cards ⇒ {+1%} point gain)",
                quote: "More points doesn't hurt, right?",
                starDiff: 0.2,
                effects: [
                    (level, star) => Object.keys(game.cards.standard.ex).length,
                    (level, star) => fx(0) ** (star * .2 + 1) * 40,
                ],
                effectors: {
                    shredMult: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)]
                }
            },
            "n1d": {
                name: "Future Calculator",
                desc: 
                    "Gain more Points based on the total amount of stat entries you've unlocked."
                    + "<br>(Currently: {0} entries ⇒ {+1%} point gain)",
                quote: "1 ^ 2 + 3 = 4",
                faction: "moon",
                effects: [
                    (level, star) => Object.values(game.flags.statUnlocks).map(x => Object.keys(x).length).reduce((x, y) => x + y),
                    (level, star) => fx(0) ** (star * .1 + .9) * 5,
                ],
                effectors: {
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)]
                }
            },
        },
        ur: {
            "n0": {
                name: "mom",
                desc: "{+0%} bulk draw, bulk power, energy cap, and card multiplier.<br>{+1%} shard gain.<br>{x2} point gain.",
                quote: "<rarity rarity='ur'></rarity> mom's so buffed she's the strongest unit in the game",
                levelCost: [1e12, 1.5, "shreds"],
                starDiff: 1,
                effects: [
                    (level, star) => level * [0, 1.2, 1.5, 1.8, 2.2, 2.6][star],
                    (level, star) => level * (2 ** star) * 10,
                    (level, star) => level ** (.1 * star + 0.9) * (2 ** star),
                ],
                effectors: {
                    bulk: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    bulkMult: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    bulkPower: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    energyCap: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    shredMult: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                    pointsMult: [priority.multiplicative, (x) => x * 1 * fx(2)],
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
            "faction": {
                name: "Overused Faction System",
                desc: "Unlock Factions. Use factioned draws to get factioned currencies and faction-specific cards.",
                quote: "Long ago, the five factions lived together in harmony. Then, everything changed when the fire faction attacked.",
                condition: () => game.cards.standard?.sr && flags.unlocked.shreds,
                crown: true,
                buyCost: [2.5e9, "shreds"],
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
        ssr: (x, n = 0) => Math.floor((5 + 5 * x) * (x + n) ** (x)),
        ur: (x, n = 0) => Math.floor((5 + 5 * x) * (x + n) ** (x)),
    }
}