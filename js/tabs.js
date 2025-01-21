let tabs = {};
let tabButtons = {};
let currentTab = "";

function initTabs() {
    makeTabButton("collection");
    makeTabButton("marketplace");
    elms.tab.$buttons.append($make("div.flex-fill"));
    makeTabButton("infobook");
    makeTabButton("options");
}

function makeTabButton(id) {
    let data = tabs[id];
    let button = $make("button");
    button.innerHTML = `
        <iconify-icon icon="${data.icon}" inline></iconify-icon>
        <span>${data.name}</span>
    `
    button.onclick = () => {
        setTab(id);
    }
    elms.tab.$buttons.append(tabButtons[id] = button);
    return button;
}

function setTab(tab) {
    tabs[currentTab]?.onDestroy?.();
    elms.tab.innerHTML = "";
    currentTab = tab;
    elms.tab.setAttribute("tab-name", tabs[currentTab].name);
    tabs[currentTab]?.onInit?.();

    for (let id in tabButtons) tabButtons[id].disabled = id == tab;
}
