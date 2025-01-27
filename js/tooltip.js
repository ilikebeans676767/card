
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
            tooltip.innerHTML = text;
        }
    },
    currency (id) {
        return (tooltip) => {
            let data = currencies[id];

            tooltip.innerHTML = `
                <div class="header">
                    <h2>${data.name}</h2>
                    <small></small>
                </div>
                <div class="quote">
                    “${verbify(data.quote)}“
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
                    <h2><rarity rarity="${rarity}"></rarity> ${data.name}</h2>
                    <small>${state ? `
                        ${data.faction
                            ? `(${data.faction} faction)`
                            : ``
                        }
                        ${data.crown 
                            ? ``
                            : `(<span class="number">+${format(state.amount)}</span> extra copies)<br>`
                        }
                        ${data.crown 
                            ? `(crowned card)`
                            : `(<span class="number">${format(state.stars)}/${format(5)}</span> stars)`
                        }
                        ${data.levelCost ? data.maxLevel
                            ? `(level <span class="number">${format(state.level)}/${format(data.maxLevel)}</span>)`
                            : `(level <span class="number">${format(state.level)}</span>)`
                            : ``
                        }
                    ` : `
                        (card not yet owned)
                    `}</small>
                </div>
                <div>
                    ${verbify(format.effect(data.desc, curFx, newFx))}
                </div>
            `

            if (mode == "level-up") {
                if (!data.levelCost) {
                    tooltip.innerHTML += `<div class="action">
                        This card can not be upgraded.
                    </div>`
                } else if (data.maxLevel && state.level >= data.maxLevel) {
                    tooltip.innerHTML += `<div class="action">
                        Max level reached.
                    </div>`
                } else {
                    let levelCost = getCardLevelCost(pack, rarity, id);
                    let canLevelUp = game.res[levelCost[1]] >= levelCost[0];
                    let name = currencies[levelCost[1]].name;
                    tooltip.innerHTML += `<div class="formula"> 
                        <h4>Upgrade cost:</h4>
                        <div><span>${name}</span>${_number(format(game.res[levelCost[1]]) + " / " + format(levelCost[0]))}</div>
                    </div><div class="action">
                        ${canLevelUp ? "Click to upgrade." : "Insufficient " + name + "."}
                    </div>`
                }
            } else if (mode == "star-up") {
                if (data.crown) {
                    tooltip.innerHTML += `<div class="action">
                        This card can not be fused.
                    </div>`
                } else if (state.stars >= 5) {
                    tooltip.innerHTML += `<div class="action">
                        Max star reached.
                    </div>`
                } else {
                    let starCost = getCardStarCost(pack, rarity, id);
                    let canStarUp = state.amount >= starCost;
                    tooltip.innerHTML += `<div class="formula"> 
                        <h4>Fusion cost:</h4>
                        <div><span>"${data.name}" extra copies</span>${_number(format(state.amount) + " / " + format(starCost))}</div>
                    </div><div class="action">
                        ${canStarUp ? "Click to fuse." : "Insufficient copies."}
                    </div>`
                }
            } else if (mode == "buy") {
                let canBuy = game.res[data.buyCost[1]] >= data.buyCost[0];
                let name = currencies[data.buyCost[1]].name;
                tooltip.innerHTML += `<div class="formula"> 
                    <h4>Purchase cost:</h4>
                    <div><span>${name}</span>${_number(format(game.res[data.buyCost[1]]) + " / " + format(data.buyCost[0]))}</div>
                </div><div class="action">
                    ${canBuy ? "Click to purchase." : "Insufficient " + name + "."}
                </div>`
            } else {
                tooltip.innerHTML += `<div class="quote">
                    “${verbify(data.quote)}“
                </div>`
            }
        }
    },
    skill (skill) {
        let data = skills[skill];
        return (tooltip) => {
            if (hasCard("standard", "ssr", "s_" + skill)) {
                tooltip.innerHTML = `
                    <div class="header">
                        <h2>${data.name}</h2>
                        <small>(skill)</small>
                    </div>
                    <div>
                        ${verbify(data.desc())}
                    </div>
                `
            } else {
                tooltip.innerHTML = `
                    This skill is locked
                `
            }
        }
    },
    badge(badge) {
        let data = badges[badge];
        return (tooltip) => {
            let obtained = !!game.badges[badge];
            tooltip.innerHTML = `
                <div class="header">
                    <h2>${verbify(data.name)}</h2>
                    <small>(${obtained ? "obtained " : "locked "}badge)</small>
                </div>
                <div>
                    ${obtained ? verbify(data.desc) : "???"}
                </div>
            `
        }
    }
}

function getCurrencyInfo(id) {
    if (id == "energy") {
        let eff = addWithCapEfficiency(game.res[id], effects.energyCap, 2);
        return `
            (you have ${_number(format(game.res[id], 0, 14))})<br>
            (${_number(format(effects.bulkPower * eff))}/min)
            ${effects.bulkPower == 0 ? "" 
                : eff == 1 ? `(${_number(format.time((effects.energyCap - game.res[id]) / effects.bulkPower * 60))} until cap)` 
                : `(${_number(format(eff * 100) + "%")} efficiency)`
            }
        `
    } else if (id == "cards") {
        return `(you've drawn ${_number(format(game.stats.cardsDrawn, 0, 14))})`
    } else {
        return `(you have ${_number(format(game.res[id], 0, 14))})`
    }
}