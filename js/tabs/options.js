tabs.options = {
    name: "Options",
    icon: "akar-icons:gear",

    elms: {},
    

    onInit() {
        let i18n = str.tabs.options;

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
        container.append($make("h3", i18n.headers.prefs()));
        makeEntry([$icon("ic:outline-language"), " " + i18n.items.language()], choiceGroup = createChoiceGroup((
            Object.fromEntries(
                Object.keys(i18nStrings).map(key => [key, i18nStrings[key].name])
            )
        ), game.option.language, (choice) => {
            setLanguage(choice);
            saveGame();
        }));
        container.append(
            $make("div.opt-entry.before",
                $make("label", ""),
                $make("small", 
                    i18n.strings.language_desc()
                )
            )
        );

        container.append($make("hr"));

        makeEntry([i18n.items.notation() + " ", 
            createInfoButton(() => verbify(i18n.strings.notation_desc()))
        ], choiceGroup = createChoiceGroup((
            Object.fromEntries([
                "default", "common", "scientific", "engineering", "si", "alphabet", "chinese", "korean"
            ].map(x => [
                x, i18n.values.notation[x]()
            ]))
        ), game.option.notation, (choice) => {
            game.option.notation = choice;
            saveGame();
        }));
        makeEntry([i18n.items.verb() + " ", 
            createInfoButton(() => verbify(i18n.strings.verb_desc()))
        ], choiceGroup = createChoiceGroup((
            Object.fromEntries(Object.entries(
                i18nStrings[game.option.language].verbs
            ).map(([key, item]) => [key, item[i18nStrings[game.option.language].primaryVerb].toTitleCase()]))
        ), game.option.verb, (choice) => {
            game.option.verb = choice;
            updateVerb();
            saveGame();
        }));
        makeEntry(i18n.items.cardImages(), choiceGroup = createChoiceGroup({
            0: i18n.values.common.hidden(),
            1: i18n.values.common.shown(),
        }, game.option.cardImages, (choice) => {
            game.option.cardImages = +choice;
            saveGame();
        }));

        container.append($make("hr"));

        makeEntry(i18n.items.music(), choiceGroup = createChoiceGroup({
            "": i18n.values.common.disabled(),
            "conscious": i18n.values.common.enabled(),
        }, game.option.music, (choice) => {
            game.option.music = choice;
            updateMusic();
            saveGame();
        }));



        elms.tab.append(container = $make("div.opt-container"));
        container.append($make("h3", i18n.headers.saves()));

        entry = makeEntry(i18n.items.localSave(), ...(() => {
            let list = [];
            let btn;

            let holder = $make("div.choice-group");
            list.push(holder);

            btn = $make("button", i18n.values.items.manualSave());
            btn.onclick = () => {
                let i18n = str.popups.save;
                if (saveGame()) {
                    let popup = callPopup("prompt", i18n.saved_title(), i18n.saved_desc());
                    popup.$content.append($make("br"), $make("small.unimportant", 
                        verbify(i18n.saved_noteLocal())
                    ))
                }
            }
            holder.append(btn);
            btn = $make("button", i18n.values.items.importExport());
            btn.onclick = () => {
                callPopup("save");
            }
            holder.append(btn);

            btn = $make("button.f-fire", i18n.values.items.hardReset());
            btn.onclick = () => {
                let i18n = str.popups.save;
                let popup = callPopup("prompt", 
                    i18n.reset_confirm_title(), 
                    "",
                    {
                        no: i18n.reset_confirm_action_no(),
                        "": "",
                        yes$danger: i18n.reset_confirm_action_yes(),
                    },
                    (x) => {
                        if (x == "yes") {
                            callPopup("prompt", i18n.busy_reset(), i18n.busy_desc(), {});
                            hardReset(popup.querySelector("#keep-opt-checkbox").checked);
                        }
                    }
                );
                popup.$content.innerHTML = i18n.reset_confirm_desc1();
                popup.$content.insertAdjacentHTML("afterend", `
                    <p>${i18n.reset_confirm_desc2()}</p>
                    <hr>
                    <p>
                        <div class="input-group">
                            <input type="checkbox" id="keep-opt-checkbox" checked>
                            <label for="keep-opt-checkbox">${i18n.opt_keepPrefs()}</label>
                        </div>
                        <small class="unimportant">${i18n.opt_keepPrefs_noteReset()}</small>
                    </p>
                    <hr>
                `)
            }
            holder.append(btn);

            return list;
        })());
        entry.$title.append($make("span.save-timer-br"), this.elms.localSaveTimer = $make("small"));

        if (cloud.type) {
            entry = makeEntry(i18n.items.cloudSave(), ...(() => {
                let list = [];
                let btn;
    
                let holder = $make("div.choice-group");
                list.push(holder);
    
                btn = this.elms.cloudSave = $make("button", i18n.values.items.manualSave());
                btn.onclick = () => {
                    let i18n = str.popups.save;
                    if (game.time.now - lastCloudSaveTime < 30000) {
                        callPopup("prompt", str.popups.common.title_error(), i18n.error_cloudSaveCooldown());
                    } else {
                        awardBadge(24);
                        saveGame();
                        let waitPopup = callPopup("prompt", i18n.busy_saving_cloud(), str.popups.common.desc_pleaseWait(), {});
                        saveToCloud(0, (success) => {
                            waitPopup.close();
                            if (success) {
                                let popup = callPopup("prompt", i18n.saved_title(), i18n.saved_desc());
                                popup.$content.append($make("br"), $make("small.unimportant", 
                                    i18n.saved_noteCloud()
                                ))
                            } else {

                            }
                        }, true)
                    }
                }
                holder.append(btn);
                btn = $make("button", i18n.values.items.checkSaves());
                btn.onclick = () => {
                    let i18n = str.popups.save;
                    if (game.time.now - lastCloudCheckTime < 30000) {
                        callPopup("prompt", str.popups.common.title_error(), i18n.error_cloudCheckCooldown());
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
        container.append($make("h3", i18n.headers.other()));

        entry = makeEntry(i18n.items.info(), ...(() => {
            let list = [];
            let btn;

            let holder = $make("div.choice-group");
            list.push(holder);

            btn = $make("button", i18n.values.items.about());
            btn.onclick = () => {
                callPopup("about");
            }
            holder.append(btn);

            return list;
        })());

        if (!cloud.type) {
            entry = makeEntry(i18n.items.otherOther(), ...(() => {
                let list = [];
                let btn;
    
                let holder = $make("div.choice-group");
                list.push(holder);
    
                btn = $make("button", i18n.values.items.john());
                btn.onclick = () => {
                    let popup = callPopup("prompt", "", "");
                    popup.classList.add("theatre");
                    popup.$header.remove();
                    popup.$content.style.margin = "0";
                    popup.$content.style.textAlign = "center";
                    popup.$content.innerHTML = `
                        <iframe src="https://john.citrons.xyz/embed?ref=ducdat0507.github.io" class="john"></iframe>
                        <small class="unimportant">${i18n.strings.john_note()}</small>
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
        let i18n = str.tabs.options;
        this.elms.localSaveTimer.innerHTML = localSaveTime < 1 ? i18n.strings.save_recent() : i18n.strings.save_timer(_number(format.time(localSaveTime)))
        if (this.elms.cloudSaveTimer) {
            let cloudSaveTime = (game.time.now - lastCloudSaveTime) / 1000;
            this.elms.cloudSave.style.display = cloud.state.loggedOut ? "none" : "";
            this.elms.cloudSaveTimer.innerHTML = `${i18n.strings["cloud_type_" + cloud.type]()}<span class="save-timer-br"></span>` + (
                cloud.state.loggedOut ? i18n.strings.cloud_loggedOut() :
                cloudStatus ? i18n.strings["cloud_status_" + cloudStatus.toLowerCase()]() :
                cloudSaveTime < 1 ? i18n.strings.save_recent() : i18n.strings.save_timer(_number(format.time(cloudSaveTime)))
            )
        }
    },


}