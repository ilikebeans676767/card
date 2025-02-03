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
                desc: "Gain {+0} points per {draw}.",
                quote: "ここにいる",
                levelCost: [10, 1.2],
                pMult: 1.2,
                effects: [
                    (level, star) => level ** ((game.cards.standard?.sr?.n1?.stars ?? 0) * .1 + 1) * star,
                ],
                effectors: {
                    points: [priority.additive, (x) => x + fx(0)]
                }
            },
            "n2": {
                name: "Half A Point",
                desc: "Randomly gain zero to {+0} points per {draw}.",
                quote: "To explain what half a point even is, we'll need to talk about parallel universes-",
                condition: () => hasCard("standard", "n", "n1"),
                levelCost: [5, 1.15],
                pMult: 1.2,
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
                desc: "{+0} base bulk. Base bulk increase the amount of {draws} you make at once.",
                quote: "Well, if you want to use up all of those one trillion card {draws} you'll need to start {drawing} multiple of them at once, you know?",
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
                pMult: 0.6,
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
                pMult: 0.6,
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
                quote: "Find cards that can't be found from {drawing}, and probably spend all of your money trying to out-bid the highest bidder",
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
                pMult: 1.2,
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
                pMult: 1.2,
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
                desc: "{+0%} base bulk, but {+1%} cooldown duration.",
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
                pMult: 0.8,
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
                pMult: 0.8,
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
                pMult: 0.8,
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
                pMult: 0.5,
                levelCost: [2, 1.5, "fire"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 12,
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
                pMult: 0.5,
                levelCost: [2, 1.5, "water"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 12,
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
                pMult: 0.5,
                levelCost: [2, 1.5, "leaf"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 12,
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
                pMult: 0.5,
                levelCost: [2, 1.5, "sun"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 12,
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
                pMult: 0.5,
                levelCost: [2, 1.5, "moon"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 12,
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
                pMult: 2,
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
                pMult: 1.2,
                effects: [
                    (level, star) => 1 + star * 0.1,
                ],
                effectors: {}
            },
            "n2": {
                name: "Dice Extractor",
                desc: "Raise the level in <b><rarity rarity='n'></rarity> Half a Point</b>'s effect by {^0:1}",
                quote: "Let the pips on the die guide you",
                pMult: 1.2,
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
                pMult: 0.5,
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
                pMult: 0.5,
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
                pMult: 0.5,
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
                pMult: 0.5,
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
                pMult: 0.5,
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
            "n5a": {
                name: "Rapid Fire",
                desc: "{/0:2} <b>Burst</b> cooldown.",
                quote: "Needs more dakka",
                faction: "fire",
                condition: () => hasCard("standard", "ex", "skills2") && hasCard("standard", "ssr", "s_fire"),
                pMult: 0.1,
                levelCost: [2e5, 2, "fire"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => 1 + level * [0, 0.01, 0.02, 0.03, 0.05, 0.08][star],
                ],
                effectors: {
                    skillFireCooldown: [priority.multiplicative, (x) => x / fx(0)],
                }
            },
            "n5b": {
                name: "Deep Freeze",
                desc: "{/0:2} <b>Freeze Drop</b> cooldown.",
                quote: "Near-absolute zero",
                faction: "water",
                condition: () => hasCard("standard", "ex", "skills2") && hasCard("standard", "ssr", "s_water"),
                pMult: 0.1,
                levelCost: [2e5, 1.5, "water"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => 1 + level * [0, 0.01, 0.02, 0.04, 0.07, 0.12][star],
                ],
                effectors: {
                    skillWaterCooldown: [priority.multiplicative, (x) => x / fx(0)],
                }
            },
            "n5c": {
                name: "NPK",
                desc: "{/0:2} <b>Fertilizer</b> cooldown.",
                quote: "Why do one when you can do all of them",
                faction: "leaf",
                condition: () => hasCard("standard", "ex", "skills2") && hasCard("standard", "ssr", "s_leaf"),
                pMult: 0.1,
                levelCost: [2e5, 1.2, "leaf"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => 1 + level * [0, 0.01, 0.02, 0.04, 0.08, 0.16][star],
                ],
                effectors: {
                    skillLeafCooldown: [priority.multiplicative, (x) => x / fx(0)],
                }
            },
            "n5d": {
                name: "Summer",
                desc: "{/0:2} <b>Photosynthesis</b> cooldown.",
                quote: "Beach episode not included",
                faction: "sun",
                condition: () => hasCard("standard", "ex", "skills2") && hasCard("standard", "ssr", "s_sun"),
                pMult: 0.1,
                levelCost: [2e5, 1.3, "sun"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => 1 + level * [0, 0.01, 0.02, 0.04, 0.07, 0.12][star],
                ],
                effectors: {
                    skillSunCooldown: [priority.multiplicative, (x) => x / fx(0)],
                }
            },
            "n5e": {
                name: "College",
                desc: "{/0:2} <b>Simplification</b> cooldown.",
                quote: "Teaches students about critical thinking",
                faction: "moon",
                condition: () => hasCard("standard", "ex", "skills2") && hasCard("standard", "ssr", "s_moon"),
                pMult: 0.1,
                levelCost: [2e5, 1.2, "moon"],
                starCost: x => cardStarCost.standard.sr(x, 3) * 25,
                effects: [
                    (level, star) => 1 + level * [0, 0.01, 0.02, 0.04, 0.08, 0.16][star],
                ],
                effectors: {
                    skillMoonCooldown: [priority.multiplicative, (x) => x / fx(0)],
                }
            },
            "c1": {
                name: "Obsessive-Compulsive",
                desc: "Unlock the ability to filter cards by some criteria.",
                condition: () => flags.unlocked.faction,
                quote: "Must... keep it... organized...",
                crown: true,
                effects: [],
                effectors: {}
            },
        },
        ssr: {
            "n0": {
                name: "Homestretch",
                desc: "{+0%} card multiplier.",
                quote: "Thank you for going this far into the game! If you like it be sure to leave a like and subscribe for more content like this",
                pMult: 2,
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
            "n0d": {
                name: "Diamond",
                desc: "{x0} Shred gain from <rarity rarity='ssr'></rarity> and above cards.",
                quote: "Diamonds are actually quite common since there are already discoveries on how to fuse them from coal, but the equipments are so expensive that they might be considered rich people's toys",
                faction: "sun",
                condition: () => flags.unlocked.skills,
                levelCost: [10000, 2, "moon"],
                starDiff: 1,
                effects: [
                    (level, star) => level * star * 2,
                ],
                effectors: {
                    shredSSRMult: [priority.multiplicative, (x) => x * fx(0)]
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
            "n1b2": {
                name: "Photo Book",
                desc: 
                    "Gain more Shreds based on the amount of badges you've got."
                    + "<br>(Currently: {0} badges ⇒ {+1%} shred gain)",
                quote: "Ahhh the memories",
                faction: "leaf",
                condition: () => flags.unlocked.shreds,
                starDiff: 0.5,
                effects: [
                    (level, star) => Object.keys(game.badges).length,
                    (level, star) => fx(0) ** (star * 0.1 + 0.9) * 5,
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
                condition: () => flags.unlocked.infobook,
                effects: [
                    (level, star) => Object.values(game.flags.statUnlocks).map(x => Object.keys(x).length).reduce((x, y) => x + y, 0),
                    (level, star) => fx(0) ** (star * .1 + .9) * 5,
                ],
                effectors: {
                    pointsMult: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)]
                }
            },
            "n1e": {
                name: "Weird Checkerboard Floor to Question Reality to",
                desc: 
                    "Gain more Shreds based on the total amount of skill reactions you've did."
                    + "<br>(Currently: {0} reactions ⇒ {+1%} shred gain)",
                quote: "All the technological advancements, just for this",
                condition: () => game.flags.statUnlocks.skills?.reaction,
                pMult: 0.7,
                starDiff: 0.2,
                effects: [
                    (level, star) => game.stats.reactionCount,
                    (level, star) => fx(0) ** (star * .1 + .9) * 4 * (1.25 ** star),
                ],
                effectors: {
                    shredMult: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)]
                }
            },
            "s_fire": {
                name: "Burst",
                desc: "Unlock the <b>Burst</b> skill.",
                quote: "Who used explosion magic inside the dungeon again!?",
                faction: "fire",
                pMult: 5,
                crown: true,
                condition: () => flags.unlocked.skills,
                effects: [],
                effectors: {}
            },
            "s_fire_1": {
                name: "Mega Burst",
                desc: "<b>Burst</b> skill skips an additional {+0s} per trigger.",
                quote: "Now with flying colors",
                faction: "fire",
                pMult: 0.5,
                condition: () => hasCard("standard", "ssr", "s_fire"),
                levelCost: [1000, 1.4, "fire"],
                effects: [
                    (level, star) => level * [0, 5, 7, 10, 14, 20][star],
                ],
                effectors: {
                    skillFireSkip: [priority.additive, (x) => x + fx(0)]
                }
            },
            "s_fire_2": {
                name: "Explosion Mastery",
                desc: 
                    "<b>Burst</b> skill gains an additional {+0s} time skip per trigger every time you use this skill."
                    + "<br>(Currently: {1} times ⇒ {+2s} time skip)",
                quote: "*particle accelerator noises*",
                faction: "fire",
                pMult: 0.3,
                starDiff: 0.5,
                condition: () => hasCard("standard", "ssr", "s_fire") && game.flags.statUnlocks.skills?.fireUse,
                effects: [
                    (level, star) => [0, 2, 3, 5, 7, 10][star],
                    (level, star) => game.stats.skillsUsed.fire ?? 0,
                    (level, star) => fx(0) * cap(fx(1), 50)
                ],
                effectors: {
                    skillFireSkip: [priority.additive, (x) => x + fx(2)]
                }
            },
            "s_water": {
                name: "Freeze Drop",
                desc: "Unlock the <b>Freeze Drop</b> skill.",
                quote: "Do you wanna build a snowman?",
                faction: "water",
                pMult: 4,
                crown: true,
                condition: () => flags.unlocked.skills,
                effects: [],
                effectors: {}
            },
            "s_water_1": {
                name: "Slow, but Steady",
                desc: "{+0%} card multiplier while <b>Freeze Drop</b> is active.",
                quote: "Better be slow to be sure",
                faction: "water",
                pMult: 0.5,
                starDiff: 0.5,
                condition: () => hasCard("standard", "ssr", "s_water"),
                levelCost: [1000, 1.3, "water"],
                effects: [
                    (level, star) => level * [0, 1, 1.5, 2, 3, 4][star],
                ],
                effectors: {
                    skillWaterCard: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)]
                }
            },
            "s_water_2": {
                name: "Top of the Mountain",
                desc: "{+0%} <b>Freeze Drop</b>'s energy cap boost, but {+1%} card multiplier when energy cap is reached while <b>Freeze Drop</b> is active.",
                quote: "🍓",
                faction: "water",
                pMult: 0.3,
                starDiff: 1,
                condition: () => hasCard("standard", "ssr", "s_water"),
                effects: [
                    (level, star) => 20 * star * star,
                    (level, star) => 5 * star,
                ],
                effectors: {
                    skillWaterGain: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    skillWaterCard2: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)]
                }
            },
            "s_leaf": {
                name: "Fertilizer",
                desc: "Unlock the <b>Fertilizer</b> skill.",
                quote: "Faster trees means faster papers means faster shreds",
                faction: "leaf",
                pMult: 3,
                crown: true,
                condition: () => flags.unlocked.skills,
                effects: [],
                effectors: {}
            },
            "s_leaf_1": {
                name: "Nurture",
                desc: "Increase <b>Fertilizer</b>'s multiplier effect by {x0:1}.",
                quote: "Take care of the trees",
                faction: "leaf",
                pMult: 0.5,
                condition: () => hasCard("standard", "ssr", "s_leaf"),
                levelCost: [1000, 1.4, "leaf"],
                effects: [
                    (level, star) => 1 + level * [0, 0.1, 0.15, 0.2, 0.3, 0.4][star],
                ],
                effectors: {
                    skillLeafMult: [priority.multiplicative, (x) => x * fx(0)]
                }
            },
            "s_sun": {
                name: "Photosynthesis",
                desc: "Unlock the <b>Photosynthesis</b> skill.",
                quote: "The sun is a not-so-deadly lazer",
                faction: "sun",
                pMult: 2.5,
                crown: true,
                condition: () => flags.unlocked.skills,
                effects: [],
                effectors: {}
            },
            "s_sun_1": {
                name: "Extra Light",
                desc: "Increase <b>Photosynthesis</b>'s buff and debuff effect by {+0%}.",
                quote: "Is this a flashbang?",
                faction: "sun",
                pMult: 0.5,
                condition: () => hasCard("standard", "ssr", "s_sun"),
                levelCost: [1000, 1.2, "sun"],
                effects: [
                    (level, star) => level * [0, 1, 1.5, 2, 3, 4][star],
                ],
                effectors: {
                    skillSunBuff: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    skillSunDebuff: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "s_moon": {
                name: "Simplification",
                desc: "Unlock the <b>Simplification</b> skill.",
                quote: "Can't hold all these currencies",
                faction: "moon",
                pMult: 2.5,
                crown: true,
                condition: () => flags.unlocked.skills,
                effects: [],
                effectors: {}
            },
            "s_moon_1": {
                name: "Abstractify",
                desc: "Increase <b>Simplification</b>'s buff by {+0%} but also its debuff by {+1%}.",
                quote: "This card has been abstracted so much that I can't even bother to write a proper flavor text for it",
                faction: "moon",
                pMult: 0.5,
                condition: () => hasCard("standard", "ssr", "s_moon"),
                levelCost: [1000, 1.2, "moon"],
                effects: [
                    (level, star) => level ** ((game.cards.standard?.ssr?.s_moon_2?.stars ?? 0) * .1 + 1) ** (star * 0.1 + 0.9) * 2.5
                        * (2 ** star),
                    (level, star) => level * 5,
                ],
                effectors: {
                    skillMoonBuff: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                    skillMoonDebuff: [priority.multiplicative, (x) => x * (1 + fx(1) / 100)],
                }
            },
            "s_moon_2": {
                name: "Abstractify^2",
                desc: "Raise the effective level in <rarity rarity='ssr'></rarity><b> Abstractify</b>'s buff effect by {^0:1}.",
                quote: "Yeah, and this one either",
                faction: "moon",
                pMult: 0.3,
                starDiff: 0.5,
                condition: () => hasCard("standard", "ssr", "s_moon_1"),
                effects: [
                    (level, star) => (star * 0.1 + 1),
                ],
            },
        },
        ur: {
            "n0": {
                name: "mom",
                desc: "{+0%} base bulk, bulk power, energy cap, and card multiplier.<br>{+1%} shred gain.<br>{x2} point gain.",
                quote: "<rarity rarity='ur'></rarity> mom's so buffed she's the strongest unit in the game",
                levelCost: [1e12, 1.5, "shreds"],
                starDiff: 1,
                pMult: 3,
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
            "n1a": {
                name: "Multi-Fire",
                desc: "Allow stacking of <b>Burst</b> skills, up to {0} uses at once.",
                quote: "Over 9000 revolutions per second",
                faction: "fire",
                condition: () => game.cards.standard?.sr?.n5a?.stars >= 2,
                pMult: 0.2,
                effects: [
                    (level, star) => 1 + star * 2,
                ],
                effectors: {
                    skillFireStack: [priority.additive, (x) => x + fx(0) - 1],
                }
            },
            "n1b": {
                name: "The Sleeping Game",
                desc: "While <b>Freeze Drop</b> is active, increase bulk power by {+0%}, but decrease time skip amount of <b>Burst</b> by the same amount.",
                quote: "Wait, that isn't what the initials mean?",
                faction: "water",
                condition: () => game.cards.standard?.sr?.n5b?.stars >= 2,
                levelCost: [1e6, 2, "water"],
                pMult: 0.2,
                effects: [
                    (level, star) => level * [0, 10, 20, 36, 55, 80][star],
                ],
                effectors: {
                    skillWaterSpeed: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n1c1": {
                name: "Seed-Picking",
                desc: 
                    "<b>Fertilizer</b> also multiply shred gains from crowned cards by {+0%}.",
                quote: "Cherry-picking but with seeds. Let the best seed wins!",
                faction: "leaf",
                condition: () => game.cards.standard?.sr?.n5c?.stars >= 2,
                levelCost: [1e6, 1.5, "leaf"],
                pMult: 0.4,
                effects: [
                    (level, star) => level * [0, 10, 20, 36, 55, 80][star],
                ],
                effectors: {
                    skillLeafMultCrown: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n1c2": {
                name: "Electrolytes",
                desc: 
                    "<b>Fertilizer</b> also multiply base shred gains by {+0%}.",
                quote: "It's got what plants crave",
                faction: "leaf",
                condition: () => game.cards.standard?.sr?.n5c?.stars >= 2,
                levelCost: [2.5e6, 2.1, "leaf"],
                pMult: 0.4,
                effects: [
                    (level, star) => level * [0, 10, 20, 36, 55, 80][star],
                ],
                effectors: {
                    skillLeafMultBase: [priority.multiplicative, (x) => x * (1 + fx(0) / 100)],
                }
            },
            "n1d": {
                name: "Sticky Cards",
                desc: 
                    "Factioned cards {drawn} while <b>Photosynthesis</b> is active have a {0%} chance to duplicate oneself.",
                quote: "It's actually two cards stuck into one, why are there so many of them here?",
                faction: "sun",
                condition: () => game.cards.standard?.sr?.n5d?.stars >= 2,
                pMult: 0.2,
                effects: [
                    (level, star) => 20 * star,
                ],
                effectors: {
                    skillSunDup: [priority.additive, (x) => x + fx(0) / 100],
                }
            },
            "n1e": {
                name: "Synergism",
                desc: 
                    "<b>Simplification</b>'s base buff effect gains {^0:1} of <rarity rarity=n></rarity> <b>Card Pack</b>'s effect.<br>"
                    + "(Currently: {+1})",
                quote: "Oh my god is that a synergism reference?????",
                faction: "moon",
                condition: () => game.cards.standard?.sr?.n5e?.stars >= 2 && game.cards.standard?.n?.n3,
                pMult: 0.2,
                effects: [
                    (level, star) => 0.2 * star,
                    (level, star) => (game.cards.standard.n.n3.level * game.cards.standard.n.n3.stars) ** fx(0),
                ],
                effectors: {
                    skillMoonBuff: [priority.additive, (x) => x + fx(1)],
                }
            },
        },
        ex: {
            "zip": {
                name: "StackRAR",
                desc: "Group together duplicate cards in the {draw} view, though the compression halves your card revealing speed in the process. Also remove the <span class='number'>100</span> bulk {draw} limit.",
                quote: "Please note that StackRAR is not a free card. After a 40 day trial period you must either buy a license or burn this card off of your collection",
                crown: true,
                buyCost: [8000, "points"],
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
                desc: "Unlock Factions. Use factioned {draws} to get factioned currencies and faction-specific cards. (Factioned currency has a rare chance to appear.)",
                quote: "Long ago, the five factions lived together in harmony. Then, everything changed when the fire faction attacked.",
                condition: () => game.cards.standard?.sr && flags.unlocked.shreds,
                crown: true,
                buyCost: [2.5e9, "shreds"],
                effects: [],
                effectors: {}
            },
            "pickit": {
                name: "pick-it Premium",
                desc: "Unlock the ability to filter upgradeable cards, albeit for a limited time.",
                quote: "You can go right to what you want to see. Nothing to get in your way. pick-it Premium will widen and deepen your card-browsing passions.",
                condition: () => hasCard("standard", "sr", "c1"),
                crown: true,
                buyCost: [5500, "water"],
                effects: [],
                effectors: {}
            },
            "skills": {
                name: "Combo",
                desc: "Unlock active skills. (Individual skills are unlocked through factioned {drawing}.)",
                quote: "↑↑↓↓←→←→BA",
                condition: () => game.cards.standard?.ssr && flags.unlocked.faction,
                crown: true,
                buyCost: [1e20, "points"],
                effects: [],
                effectors: {}
            },
            "skills2": {
                name: "Incantation-less Magic Pack",
                desc: "Unlock cards that reduce cooldowns of skills.",
                quote: "Did you know that the earlier you learn incantation-less magic the easier it is to do it?",
                condition: () => game.stats.reactionCount > 0,
                crown: true,
                buyCost: [1e30, "points"],
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