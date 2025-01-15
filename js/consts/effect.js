const baseEffect = {
    bulk: 1,
    bulkPower: 0,
    bulkMult: 1,

    energyCap: 10,
    
    points: 0,
    pointsExtra: 0,
    pointsMult: 1,

    shredMult: 1,
    shredRMult: 1,
    shredSRMult: 1,
    shredSSRMult: 1,
    shredURMult: 1,
    shredCrownMult: 10,

    cooldownTime: 3,
    breakTime: 5,
    breakSkip: 0.3,
    revealTime: 0.5,
    revealSkip: 1,
}

const flags = {
    unlocked: {
        points: false,
        shreds: false,
        energy: false,
        market: false,
    }
}

const priority = {
    additive_before:       0,
    additive:              1,
    additive_after:        2,
    multiplicative_before: 10,
    multiplicative:        11,
    multiplicative_after:  12,
}