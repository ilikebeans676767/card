tabs.options = {
    name: "Options",
    icon: "akar-icons:gear",

    cards: {},
    elms: {},

    onInit() {
        let container, choiceGroup;
        function makeEntry(title, ...content) {
            let div = $make("div.opt-entry");
            div.append($make("label", title));
            div.append($make("span", ...content));
            container.append(div);
            if (content[0]?.scrollToChoice) content[0].scrollToChoice();
            return div;
        }

        elms.tab.append(container = $make("div.opt-container"));
        container.append($make("h3", "Preferences"));
        makeEntry("Number Format", choiceGroup = createChoiceGroup({
            default: "Default",
            scientific: "Scientific",
            engineering: "Engineering",
            si: "SI Prefixes",
            alphabet: "Alphabet",
            chinese: "Chinese",
            korean: "Korean",
        }, game.option.notation, (choice) => {
            game.option.notation = choice;
            saveGame();
        }));

        makeEntry("Background Music", choiceGroup = createChoiceGroup({
            "": "Disabled",
            "conscious": "Enabled",
        }, game.option.music, (choice) => {
            game.option.music = choice;
            updateMusic();
            saveGame();
        }));
    },
}