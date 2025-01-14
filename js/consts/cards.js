const cards = {
    standard: {
        n: {
            0: {
                name: "The Nothing Square",
                desc: "No effect.",
                quote: "That one square that is programmed to be picked 99% of the time",
                maxLevel: 0,
                effects: [],
                effectors: {}
            },
            1: {
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
            2: {
                name: "Half A Point",
                desc: "Randomly gain zero to {+0} points per draw.",
                quote: "To explain what half a point even is, we'll need to talk about parallel universes-",
                condition: () => hasCard("standard", "n", "1"),
                levelCost: [5, 1.3],
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    pointsExtra: [priority.additive, (x) => x + fx(0)]
                }
            },
            3: {
                name: "Card Pack",
                desc: "{+0} bulk draw. Bulk draw allows you to use multiple draws at once.",
                quote: "Well, if you want to use up all of those one trillion card draws you'll need to start drawing multiple of them at once, you know?",
                levelCost: [5, 1.2],
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    bulk: [priority.additive, (x) => x + fx(0)]
                }
            },
            4: {
                name: "Self-Filling Pack",
                desc: "{+0} bulk power. Bulk power generates bulk energy which acts as a temporary bulk draw increase that is spent upon drawing.",
                quote: "Incremental games, also known as idle games",
                condition: () => hasCard("standard", "n", "3"),
                levelCost: [15, 1.3],
                effects: [
                    (level, star) => level * star * 5,
                ],
                effectors: {
                    bulkPower: [priority.additive, (x) => x + fx(0)]
                }
            },
            5: {
                name: "Scissors",
                desc: "{+0%} pack breaking speed.",
                quote: "If you haven't noticed it yet, you can click the pack while it's breaking to break it faster",
                levelCost: [25, 1.5],
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    breakTime: [priority.multiplicative, (x) => x / (1 + fx(0) / 100)]
                }
            },
            6: {
                name: "Fast Delivery",
                desc: "{+0%} cooldown speed.",
                quote: "Restock faster with our new fast delivery service—applied to all orders 1 card and above!",
                levelCost: [25, 1.5],
                effects: [
                    (level, star) => level * star,
                ],
                effectors: {
                    cooldownTime: [priority.multiplicative, (x) => x / (1 + fx(0) / 100)]
                }
            },
            c1: {
                name: "In-Game Shop",
                desc: "Unlock the Marketplace.",
                quote: "Find cards that can't be found from drawing, and probably spend all of your money trying to out-bid the highest bidder",
                crown: true,
                effects: [],
                effectors: {}
            },
        },
        ex: {
            zip: {
                name: "StackRAR",
                desc: "Group together duplicate cards in the draw view, though the compression halves your card revealing speed in the process. Also remove the <span class='number'>100</span> bulk draw limit.",
                quote: "Please note that StackRAR is not a free card. After a 40 day trial period you must either buy a license or burn this card off of your collection",
                crown: true,
                buyCost: [1e6, "points"],
                effects: [],
                effectors: {
                    revealTime: [priority.multiplicative, (x) => x * 2]
                }
            },
        }
    }
}

const cardStarCost = {
    standard: {
        n: (x) => (20 + 5 * x) * x ** (x + 1)
    }
}