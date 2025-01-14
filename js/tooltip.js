
let tooltipTimeout = 0;
function registerTooltip(element, contentFunc) {
    element.addEventListener("pointerenter", () => {
        clearTimeout(tooltipTimeout);
        document.body.addEventListener("pointermove", updateTooltipPos);
        tooltipTimeout = setTimeout(() => {
            elms.tooltip.innerHTML = "";
            contentFunc(elms.tooltip);
            elms.tooltip.classList.add("active");
        }, elms.tooltip.classList.contains("active") ? 0 : 300);
    });
    element.addEventListener("pointerleave", () => {
        clearTimeout(tooltipTimeout);
        document.body.removeEventListener("pointermove", updateTooltipPos);
        tooltipTimeout = setTimeout(() => {
            elms.tooltip.classList.remove("active");
        }, 100);
    });
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
    card (pack, rarity, id, mode = null) {
        let data = cards[pack][rarity][id];
        return (tooltip) => {
            let state = game.cards[pack]?.[rarity]?.[id];

            let level = 1, stars = 1;
            if (state) ({level, stars} = state);
            let curFx = [], newFx = null;
            fx = (x) => curFx[x];
            for (let f of data.effects) curFx.push(f(level, stars));

            if (mode == "level-up") {
                newFx = [];
                fx = (x) => newFx[x];
                for (let f of data.effects) newFx.push(f(level + 1, stars));
            } else if (mode == "star-up") {
                newFx = [];
                fx = (x) => newFx[x];
                for (let f of data.effects) newFx.push(f(level, stars + 1));
            }

            tooltip.innerHTML = `
                <div class="tooltip-header">
                    <h2><rarity rarity="${rarity}"></rarity> ${data.name}</h2>
                    <small>${state ? `
                        ${data.crown 
                            ? ``
                            : `(you have <span class="number">${format(state.amount)}</span> extra copies)<br>`
                        }
                        ${data.crown 
                            ? `(crown card)`
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
                    ${format.effect(data.desc, curFx, newFx)}
                </div>
                <div class="tooltip-quote">
                    “${data.quote}“
                </div>
            `
        }
    }
}