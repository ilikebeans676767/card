
let tooltip = {
    timeout: 0,
    element: null,
    contentFunc: null,
}
function registerTooltip(element, contentFunc) {
    element.addEventListener("pointerenter", (ev) => {
        clearTimeout(tooltip.timeout);
        if (prefersNoTooltips()) return;
        document.body.addEventListener("pointermove", updateTooltipPos);
        tooltip.element = element;
        tooltip.contentFunc = contentFunc;
        updateTooltipPos(ev);
        tooltip.timeout = setTimeout(() => {
            elms.tooltip.innerHTML = "";
            contentFunc(elms.tooltip);
            elms.tooltip.classList.add("active");
        }, elms.tooltip.classList.contains("active") ? 0 : 300);
    });
    element.addEventListener("pointerleave", () => {
        clearTimeout(tooltip.timeout);
        document.body.removeEventListener("pointermove", updateTooltipPos);
        tooltip.element = tooltip.contentFunc = null
        tooltip.timeout = setTimeout(() => {
            elms.tooltip.classList.remove("active");
        }, 100);
    });
}
let registeredTooltipEvents = {};
function registerTooltipEvent(event) {
    if (!tooltip.element || registeredTooltipEvents[event]) return;
    registeredTooltipEvents[event] = true;
    let elm = tooltip.element;
    let func = tooltip.contentFunc;
    let callback = () => {
        requestAnimationFrame(() => func(elms.tooltip));
    }
    let leave = () => {
        removeEvent(event, callback);
        delete registeredTooltipEvents[event];
        elm.removeEventListener("pointerleave", leave);
    }
    addEvent(event, callback);
    elm.addEventListener("pointerleave", leave);
}

function prefersNoTooltips() {
    return window.innerWidth < 800 || window.matchMedia("(hover: none)").matches;
}


function updateTooltipPos(ev) {
    let inset = { top: "auto", left: "auto", bottom: "auto", right: "auto" };

    if (ev.clientX < window.innerWidth / 2) inset.left = ev.clientX + "px";
    else inset.right = window.innerWidth - ev.clientX + "px";
    if (ev.clientY < window.innerHeight / 2) inset.top = ev.clientY + "px";
    else inset.bottom = window.innerHeight - ev.clientY + "px";

    elms.tooltip.style.inset = inset.top + " " + inset.right + " " + inset.bottom + " " + inset.left;
}

let tooltipTemplates = {
    text (text) {
        return (tooltip) => {
            tooltip.innerHTML = typeof text == "function" ? text() : text;
        }
    },
    currency (id) {
        return (tooltip) => {
            let data = currencies[id];
            let i18n = str.currencies[id];

            tooltip.innerHTML = `
                <div class="header">
                    <h2>${i18n.name()}</h2>
                    <small></small>
                </div>
                <div class="quote">
                    ${str.format.marks.quote(verbify(i18n.quote()))}
                </div>
            `

            let info = tooltip.querySelector("small");
            let update = () => {
                if (!info.isConnected || !tooltip.classList.contains("active")) removeEvent("frame", update);
                else {
                    info.innerHTML = getCurrencyInfo(id);
                }
            }
            update();
            addEvent("frame", update);  
        }
    },
    card (pack, rarity, id, mode = null) {
        let data = cards[pack][rarity][id];
        return (tooltip) => {
            let i18n = str.cards[pack][rarity][id];
            let popupI18n = str.popups.card;
            registerTooltipEvent("card-update");
            let state = game.cards[pack]?.[rarity]?.[id];

            let level = 1, stars = 1;
            if (state) ({level, stars} = state);
            let curFx = [], newFx = null;
            fx = (x) => curFx[x];
            for (let f of data.effects) curFx.push(f(level, stars));

            if (mode == "level-up") {
                if (!data.maxLevel || level < data.maxLevel) {
                    newFx = [];
                    fx = (x) => newFx[x];
                    for (let f of data.effects) newFx.push(f(level + 1, stars));
                }
            } else if (mode == "star-up") {
                if (stars < 5) {
                    newFx = [];
                    fx = (x) => newFx[x];
                    for (let f of data.effects) newFx.push(f(level, stars + 1));
                }
            }

            tooltip.innerHTML = `
                <div class="header">
                    <h2><rarity rarity="${rarity}"></rarity> ${i18n.name()}</h2>
                    <small>${state ? `
                        ${data.faction
                            ? `${popupI18n.factions[data.faction]()}<br>`
                            : ``
                        }
                        ${data.crown 
                            ? ``
                            : `${popupI18n.strings.copies(_number(`+${format(state.amount)}`))}<br>`
                        }
                        ${data.crown 
                            ? popupI18n.strings.crown()
                            : popupI18n.strings.stars(_number(`${format(state.stars)}/${format(5)}`))
                        }
                        ${data.levelCost ? data.maxLevel
                            ? popupI18n.strings.stars(_number(`${format(state.level)}/${format(data.maxLevel)}`))
                            : popupI18n.strings.stars(_number(format(state.level)))
                            : ``
                        }
                    ` : popupI18n.strings.notOwned()}</small>
                </div>
                <div>
                    ${verbify(format.effect(i18n.desc(), curFx, newFx))}
                </div>
            `

            if (mode == "level-up") {
                if (!data.levelCost) {
                    tooltip.innerHTML += `<div class="action">
                        ${popupI18n.strings.level_cant()}
                    </div>`
                } else if (data.maxLevel && state.level >= data.maxLevel) {
                    tooltip.innerHTML += `<div class="action">
                        ${popupI18n.strings.level_cant_max()}
                    </div>`
                } else {
                    let levelCost = getCardLevelCost(pack, rarity, id);
                    let canLevelUp = game.res[levelCost[1]] >= levelCost[0];
                    let name = str.currencies[levelCost[1]].name();
                    tooltip.innerHTML += `<div class="formula"> 
                        <h4>${popupI18n.strings.level_cost()}</h4>
                        <div><span>${name}</span>${_number(format(game.res[levelCost[1]]) + " / " + format(levelCost[0]))}</div>
                    </div><div class="action">
                        ${canLevelUp ? popupI18n.strings.level_prompt() : popupI18n.strings.level_cant_cost(name)}
                    </div>`
                }
            } else if (mode == "star-up") {
                if (data.crown) {
                    tooltip.innerHTML += `<div class="action">
                        ${popupI18n.strings.star_cant()}
                    </div>`
                } else if (state.stars >= 5) {
                    tooltip.innerHTML += `<div class="action">
                        ${popupI18n.strings.star_cant_max()}
                    </div>`
                } else {
                    let starCost = getCardStarCost(pack, rarity, id);
                    let canStarUp = state.amount >= starCost;
                    tooltip.innerHTML += `<div class="formula"> 
                        <h4>${popupI18n.strings.star_cost()}</h4>
                        <div><span>${popupI18n.strings.star_cost_copies(i18n.name)}</span>${_number(format(state.amount) + " / " + format(starCost))}</div>
                    </div><div class="action">
                        ${canStarUp ? popupI18n.strings.star_prompt() : popupI18n.strings.star_cant_cost()}
                    </div>`
                }
            } else if (mode == "buy") {
                let canBuy = game.res[data.buyCost[1]] >= data.buyCost[0];
                let name = str.currencies[data.buyCost[1]].name();
                tooltip.innerHTML += `<div class="formula"> 
                    <h4>Purchase cost:</h4>
                    <div><span>${name}</span>${_number(format(game.res[data.buyCost[1]]) + " / " + format(data.buyCost[0]))}</div>
                </div><div class="action">
                    ${canBuy ? "Click to purchase." : "Insufficient " + name + "."}
                </div>`
            } else {
                tooltip.innerHTML += `<div class="quote">
                    ${str.format.marks.quote(verbify(i18n.quote()))}
                </div>`
            }
        }
    },
    skill (skill) {
        let data = skills[skill];
        return (tooltip) => {
            let i18n = str.skills[skill];
            let popupI18n = str.popups.skill
            if (hasCard("standard", "ssr", "s_" + skill)) {
                tooltip.innerHTML = `
                    <div class="header">
                        <h2>${i18n.name()}</h2>
                        <small>${popupI18n.strings.skill()}</small>
                    </div>
                    <div>
                        ${verbify(data.desc())}
                    </div>
                `
            } else {
                tooltip.textContent = popupI18n.strings.skill_locked();
            }
        }
    },
    badge(badge) {
        let data = badges[badge];
        return (tooltip) => {
            let obtained = !!game.badges[badge];
            tooltip.innerHTML = `
                <div class="header">
                    <h2>${verbify(str.badges[badge].name())}</h2>
                    <small>${str.popups.badge.strings["state_" + (obtained ? "obtained" : "locked")]()}</small>
                </div>
                <div>
                    ${obtained ? verbify(str.badges[badge].desc()) : str.popups.badge.strings.lock_desc()}
                </div>
            `
        }
    }
}

function getCurrencyInfo(id) {
    let i18n = str.popups.currency;
    if (id == "energy") {
        let eff = addWithCapEfficiency(game.res[id], effects.energyCap, 2);
        return `
            ${i18n.strings.amount_have(_number(format(game.res[id], 0, 14)))}<br>
            ${i18n.strings.speed_minute(_number(format(effects.bulkPower * eff)))}
            ${effects.bulkPower == 0 ? "" 
                : eff == 1 ? i18n.strings.toCap(_number(format.time((effects.energyCap - game.res[id]) / effects.bulkPower * 60)))
                : i18n.strings.efficiency(_number(format.chance(eff)))
            }
        `
    } else if (id == "cards") {
        return verbify(i18n.strings.amount_drawn(_number(format(game.stats.cardsDrawn, 0, 14))))
    } else {
        return i18n.strings.amount_have(_number(format(game.res[id], 0, 14)))
    }
}