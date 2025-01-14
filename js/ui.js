function $(query) {
    return document.querySelector(query);
}

function $make(tag, ...content) {
    let node = document.createElement(tag);
    node.append(...content);
    return node;
}

function createCurrencyUI(currency) {
    let title = $make("span", currency.name);
    let amount = $make("span", 0);

    let div = $make("div", title, amount);
    div.$title = title;
    div.$amount = amount;
    div.classList.add("currency");

    return div;
}

function createCardUI(pack, rarity, id) {
    let data = cards[pack][rarity][id];

    let div = $make("article");
    div.classList.add("game-card");

    let img = div.$img = $make("img");
    img.src = `res/cards/${pack}/${rarity}_${id}.png`;
    div.append(img);
    let name = div.$name = $make("div");
    name.classList.add("game-card-name");
    name.innerHTML = `<rarity rarity="${rarity}"></rarity> ${data.name}`;
    div.append(name);

    let stars = div.$stars = $make("div");
    stars.classList.add("game-card-stars");
    div.append(stars);

    div.update = () => {
        let state = game.cards[pack]?.[rarity]?.[id] ?? { stars: 0 };
        if (data.crown) {
            stars.innerHTML = `<iconify-icon icon='material-symbols-light:crown${0 < state.stars ? "" : "-outline"}-rounded'>`;
        } else {
            stars.innerHTML = "";
            for (let a = 0; a < 5; a++) {
                stars.innerHTML += `<iconify-icon icon='material-symbols-light:star${a < state.stars ? "" : "-outline"}-rounded'>`;
            }
        }
    }

    return div;
}