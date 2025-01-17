function $(query) {
    return document.querySelector(query);
}

function $make(def, ...content) {
    let classes = def.split(".");
    let [tag, id] = classes.splice(0, 1)[0].split("#");
    let node = document.createElement(tag);
    if (id) node.id = id;
    if (classes.length) node.classList.add(...classes);
    node.append(...content);
    return node;
}

function $icon(source, inline = true) {
    return `<iconify-icon icon="${source}"${inline ? ' inline=""' : ""}></iconify-icon>`;
}

function $number(inside) {
    return `<span class="number">${inside}</span>`;
}


function createCurrencyUI(id) {
    let currency = currencies[id];
    let title = $make("span", currency.name);
    let amount = $make("span", 0);

    let div = $make("div.currency", title, amount);
    div.$title = title;
    div.$amount = amount;

    registerTooltip(div, tooltipTemplates.currency(id));

    return div;
}

function createCardUI(pack, rarity, id) {
    let data = cards[pack][rarity][id];

    let div = $make("article.game-card");
    div.setAttribute("rarity", rarity);

    let img = div.$img = $make("img");
    img.src = `res/cards/${pack}/${rarity}_${id}.png`;
    img.onerror = () => (img.src = "res/cards/placeholder.png");
    div.append(img);
    let name = div.$name = $make("div.game-card-name");
    name.innerHTML = `<rarity rarity="${rarity}"></rarity> ${data.name}`;
    div.append(name);

    let stars = div.$stars = $make("div.game-card-stars");
    if (data.crown) stars.classList.add("crown");
    div.append(stars);

    div.update = () => {
        let state = game.cards[pack]?.[rarity]?.[id];
        let starsHTML = "";
        if (!state) {
            starsHTML = "";
        } else if (data.crown) {
            starsHTML = $icon("ph:crown-fill");
        } else {
            starsHTML = "";
            for (let a = 0; a < 5; a++) {
                starsHTML += $icon(`tabler:star${a < state.stars ? "-filled" : ""}`);
            }
        }
        if (stars.innerHTML != starsHTML) {
            console.log(stars.innerHTML, starsHTML);
            stars.innerHTML = starsHTML;
        }
    }

    return div;
}

function createChoiceGroup(options, value, onChoice) {
    let div = $make("div.choice-group");
    div.value = value;
    let buttons = {};

    function set(value) {
        div.value = value;
        update(value);
        onChoice(value);
    }

    function update(value) {
        for (let btn in buttons) {
           buttons[btn].disabled = btn == value;
        }
    }

    for (const opt in options) {
        let btn = $make("button", options[opt]);
        btn.onclick = () => set(opt);
        buttons[opt] = btn;
        div.append(btn);
    }

    div.scrollToChoice = () => {
        let value = div.value;
        console.log(value);
        if (buttons[value]) {
            let divRect = div.getBoundingClientRect();
            let btnRect = buttons[value].getBoundingClientRect();
            div.scrollTo({ left: (btnRect.left + btnRect.right - divRect.width) / 2 - divRect.left });
            console.log(divRect, btnRect);
        }
    }

    update(value);
    return div;
}