const skills = {
    fire: {
        name: "Burst",
        icon: "tabler:bomb",
        desc: () => {
            return `
                Instantly gain ${_number(format.time(effects.skillFireSkip))} worth of bulk energy.
                <br>Cooldown: ${_number(format.time(effects.skillFireCooldown))}
            `;
        },
        trigger: () => {
            game.res.energy = addWithCap(game.res.energy, effects.skillFireSkip / 60 * effects.bulkPower, effects.energyCap);
            if (game.time.skillStacks.fire > 0) game.time.skillStacks.fire--;
            else game.time.skillCooldowns.fire = effects.skillFireCooldown;
        },
    },
    water: {
        name: "Freeze Drop",
        icon: "tabler:snowflake",
        desc: () => {
            return `
                Increase the bulk energy cap by ${_number("×" + format(effects.skillWaterGain, 2))} until the next {draw},
                but increase its cooldown by ${_number("×" + format(effects.skillWaterWait, 2))}.
                <br>Cooldown: ${_number(format.time(effects.skillWaterCooldown))}
            `;
        },
        trigger: () => {
            game.drawPref.skills.water = true;
            game.time.skillCooldowns.water = effects.skillWaterCooldown;
        },
    },
    leaf: {
        name: "Fertilizer",
        icon: "tabler:christmas-tree",
        desc: () => {
            return `
                Increase all shred multiplier per rarity increase by ${_number("×" + format(effects.skillLeafMult, 2))} for the next {draw}.
                <br>Cooldown: ${_number(format.time(effects.skillLeafCooldown))}
            `;
        },
        trigger: () => {
            game.drawPref.skills.leaf = true;
            game.time.skillCooldowns.leaf = effects.skillLeafCooldown;
        },
    },
    sun: {
        name: "Photosynthesis",
        icon: "icon-park-outline:sapling",
        desc: () => {
            return `
                Increase faction power gain by ${_number("×" + format(effects.skillSunBuff, 2))} for the next {draw},
                but decrease point and shred gain by ${_number("/" + format(effects.skillSunDebuff, 2))}
                <br>Cooldown: ${_number(format.time(effects.skillSunCooldown))}
            `;
        },
        trigger: () => {
            game.drawPref.skills.sun = true;
            game.time.skillCooldowns.sun = effects.skillSunCooldown;
        },
    },
    moon: {
        name: "Simplification",
        icon: "lucide:wrench",
        desc: () => {
            return `
                Increase point gain by ${_number("×" + format(effects.skillMoonBuff, 2))} for the next {draw},
                but decrease faction power gain by ${_number("/" + format(effects.skillMoonDebuff, 2))}
                <br>Cooldown: ${_number(format.time(effects.skillMoonCooldown))}
            `;
        },
        trigger: () => {
            game.drawPref.skills.moon = true;
            game.time.skillCooldowns.moon = effects.skillMoonCooldown;
        },
    },
}