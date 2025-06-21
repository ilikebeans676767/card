let ads = {
    videos: {},
    minigames: {},
}

let adOffers = {
    points_draw: {
        getOffer(args) {
            return {
                mult: 4,
                duration: adFuncs.drawMult(6 + args.rng * 2) + 920,
            }
        },
        onAward(offer) {
            addBuff("draw", "pointsMult", offer);
        },
        getDisplayArgs: (offer) => [offer.mult, offer.duration],
    },
    shreds_draw: {
        condition: () => flags.unlocked.shreds,
        getOffer(args) {
            return {
                mult: 3,
                duration: adFuncs.drawMult(5 + args.rng * 2) + 64000,
            }
        },
        onAward(offer) {
            addBuff("draw", "shredsMult", offer);
        },
        getDisplayArgs: (offer) => [offer.mult, offer.duration],
    },
}

let adFuncs = {
    drawMult: (mins) => Math.ceil((effects.bulk / effects.cooldownTime * 60 + effects.bulkPower) * effects.bulkMult * mins)
}

function playAd() {
    let ad = Math.random() < 0 ? ads.videos : ads.minigames;
    ad = ad[Object.keys(ad).pick()]

    callPopup("ad", ad);
}