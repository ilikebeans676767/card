tabs.options = {
    name: "Options",
    icon: "akar-icons:gear",

    elms: {},

    onInit() {
        let container, choiceGroup, entry;
        function makeEntry(title, ...content) {
            let div = $make("div.opt-entry");
            div.append(div.$title = $make("label", title));
            div.append(div.$content = $make("span", ...content));
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
        makeEntry(["Verb ", 
            createInfoButton(() => `Change the verb associated with ${getVerb("drawing")} cards, in places such as the game title and item descriptions.`)
        ], choiceGroup = createChoiceGroup((
            Object.fromEntries(Object.entries(verbs).map(([key, item]) => [key, item.draw.toTitleCase()]))
        ), game.option.verb, (choice) => {
            game.option.verb = choice;
            updateVerb();
            saveGame();
        }));
        makeEntry("Card Images", choiceGroup = createChoiceGroup({
            0: "Disabled",
            1: "Enabled",
        }, game.option.cardImages, (choice) => {
            game.option.cardImages = +choice;
            saveGame();
        }));
        container.append($make("hr"));
        makeEntry("Background Music", choiceGroup = createChoiceGroup({
            "": "Disabled",
            "conscious": "Enabled",
        }, game.option.music, (choice) => {
            game.option.music = choice;
            updateMusic();
            saveGame();
        }));



        elms.tab.append(container = $make("div.opt-container"));
        container.append($make("h3", "Save Management"));

        entry = makeEntry("Local Save", ...(() => {
            let list = [];
            let btn;

            let holder = $make("div.choice-group");
            list.push(holder);

            btn = $make("button", "Manual Save");
            btn.onclick = () => {
                if (saveGame()) {
                    let popup = callPopup("prompt", "Game saved", "It is now safe to close this tab.");
                    popup.$content.append($make("br"), $make("small.unimportant", 
                        "(Note: this game auto-saves after a minute since the last save and on certain events such as after a draw"
                            + " and when a setting is changed)"
                    ))
                }
            }
            holder.append(btn);
            btn = $make("button", "Import/Export Save");
            btn.onclick = () => {
                callPopup("save");
            }
            holder.append(btn);

            btn = $make("button.f-fire", "Hard Reset");
            btn.onclick = () => {
                let popup = callPopup("prompt", 
                    "Really hard reset?", 
                    "",
                    {
                        no: "No, go back",
                        "": "",
                        yes$danger: "Yes, hard reset",
                    },
                    (x) => {
                        if (x == "yes") {
                            callPopup("prompt", "Hard resetting...", "(the game will reload in a moment, don't close the game in the process)", {});
                            hardReset(popup.querySelector("#keep-opt-checkbox").checked);
                        }
                    }
                );
                popup.$content.innerHTML = `
                    This action will <strong>COMPLETELY WIPE YOUR SAVE CLEAN.</strong> You'll go back to the very beginning 
                    of the game with <strong>NO BONUSES IN RETURN.</strong>
                `
                popup.$content.insertAdjacentHTML("afterend", `
                    <p>The game will copy the current save data to your clipboard in case you change your mind.</p>
                    <hr>
                    <p>
                        <div class="input-group">
                            <input type="checkbox" id="keep-opt-checkbox" checked>
                            <label for="keep-opt-checkbox">Keep preferences</label>
                        </div>
                        <small class="unimportant">(Note: preferences that are bound to an unlockable will be changed to a different one)</small>
                    </p>
                    <hr>
                `)
            }
            holder.append(btn);

            return list;
        })());
        entry.$title.append($make("span.save-timer-br"), this.elms.localSaveTimer = $make("small"));

        if (cloud.type) {
            entry = makeEntry("Cloud Save", ...(() => {
                let list = [];
                let btn;
    
                let holder = $make("div.choice-group");
                list.push(holder);
    
                btn = this.elms.cloudSave = $make("button", "Manual Save");
                btn.onclick = () => {
                    if (game.time.now - lastCloudSaveTime < 30000) {
                        callPopup("prompt", "Error", "Please wait 30 seconds between cloud saves.");
                    } else {
                        awardBadge(24);
                        saveGame();
                        let waitPopup = callPopup("prompt", "Saving to cloud", "Please wait...", {});
                        saveToCloud(0, (success) => {
                            waitPopup.close();
                            if (success) {
                                let popup = callPopup("prompt", "Game saved", "It is now safe to close this tab.");
                                popup.$content.append($make("br"), $make("small.unimportant", 
                                    "(Note: this game auto-saves to the cloud after 5 minutes since the last cloud save)"
                                ))
                            } else {

                            }
                        })
                    }
                }
                holder.append(btn);
                btn = $make("button", "Check Saves");
                btn.onclick = () => {
                    if (game.time.now - lastCloudCheckTime < 30000) {
                        callPopup("prompt", "Error", "Please wait 30 seconds between cloud save checks.");
                    } else {
                        checkCloudSave(true);
                    }
                }
                holder.append(btn);
    
                return list;
            })());
            entry.$title.append($make("span.save-timer-br"), this.elms.cloudSaveTimer = $make("small"));
        }

        elms.tab.append(container = $make("div.opt-container"));
        container.append($make("h3", "Other"));

        entry = makeEntry("Info", ...(() => {
            let list = [];
            let btn;

            let holder = $make("div.choice-group");
            list.push(holder);

            btn = $make("button", "About & Credits");
            btn.onclick = () => {
                callPopup("about");
            }
            holder.append(btn);

            return list;
        })());

        if (!cloud.type) {
            entry = makeEntry("Other other", ...(() => {
                let list = [];
                let btn;
    
                let holder = $make("div.choice-group");
                list.push(holder);
    
                btn = $make("button", "johnvertisement");
                btn.onclick = () => {
                    let popup = callPopup("prompt", "", "");
                    popup.classList.add("theatre");
                    popup.$header.remove();
                    popup.$content.style.margin = "0";
                    popup.$content.style.textAlign = "center";
                    popup.$content.innerHTML = `
                        <iframe src="https://john.citrons.xyz/embed?ref=ducdat0507.github.io" class="john"></iframe>
                        <small class="unimportant">(Note: links open in this tab, ctrl+click to not accidentally close the game)</small>
                    `
                }
                holder.append(btn);
    
                return list;
            })());
        }
    },
    onDestroy() {
        this.elms = {}
    },
    onFrame() {
        let localSaveTime = (game.time.now - lastSaveTime) / 1000;
        this.elms.localSaveTimer.innerHTML = localSaveTime < 1 ? `(game saved)` : `(last saved ${_number(format.time(localSaveTime))} ago)`
        if (this.elms.cloudSaveTimer) {
            let cloudSaveTime = (game.time.now - lastCloudSaveTime) / 1000;
            this.elms.cloudSave.style.display = cloud.state.loggedOut ? "none" : "";
            this.elms.cloudSaveTimer.innerHTML = `(connected to ${cloud.type})<span class="save-timer-br"></span>` + (
                cloud.state.loggedOut ? `(logged out)` :
                cloudStatus ? `(${cloudStatus.toLowerCase()}...)` :
                cloudSaveTime < 1 ? `(game saved)` : `(last saved ${_number(format.time(cloudSaveTime))} ago)`
            )
        }
    },


}