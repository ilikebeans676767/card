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
    return `<iconify-icon icon="${source}"${inline ? " inline" : ""}></iconify-icon>`;
}

function $number(inside) {
    return `<span class="number">${inside}</span>`;
}


function createCurrencyUI(currency) {
    let title = $make("span", currency.name);
    let amount = $make("span", 0);

    let div = $make("div.currency", title, amount);
    div.$title = title;
    div.$amount = amount;

    return div;
}

function createCardUI(pack, rarity, id) {
    let data = cards[pack][rarity][id];

    let div = $make("article.game-card");

    let img = div.$img = $make("img");
    img.src = `res/cards/${pack}/${rarity}_${id}.png`;
    div.append(img);
    let name = div.$name = $make("div.game-card-name");
    name.innerHTML = `<rarity rarity="${rarity}"></rarity> ${data.name}`;
    div.append(name);

    let stars = div.$stars = $make("div.game-card-stars");
    if (data.crown) stars.classList.add("crown");
    div.append(stars);

    div.update = () => {
        let state = game.cards[pack]?.[rarity]?.[id];
        if (!state) {
            stars.innerHTML = "";
        } else if (data.crown) {
            stars.innerHTML = $icon("ph:crown-fill");
        } else {
            stars.innerHTML = "";
            for (let a = 0; a < 5; a++) {
                stars.innerHTML += $icon(`tabler:star${a < state.stars ? "-filled" : ""}`);;
            }
        }
    }

    return div;
}