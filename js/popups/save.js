popups.save = {
    call() {
        let popup = makePopup();

        popup.$body.append(popup.$header = $make("h3.header", "Import/Export Save"));
        popup.$body.append(popup.$content = $make("p", "The text box below contains your save data. Copy your save and keep it somewhere safe."));
        popup.$content.innerHTML += "<br>Alternatively, paste your save there and press \"Import from Text Box\" to load the save.";

        let saveText = $make("textarea.save-box");
        saveText.value = getTextSaveString();
        popup.$body.append(saveText);

        let actions, saveActions, actionGroup, btn;
        popup.$body.append(popup.$actions = actions = $make("div.actions"));

        btn = $make("button", "Close");
        btn.onclick = popup.close;
        actions.append(btn);

        popup.$body.append(saveActions = $make("div.save-actions"));
        actions.append(saveActions);

        popup.$body.append(actionGroup = $make("div.action-group"));
        saveActions.append(actionGroup);
        btn = $make("button.primary", "Copy to Clipboard");
        btn.onclick = () => {
            awardBadge(24);
            navigator.clipboard.writeText(getTextSaveString()).then(() => {
                callPopup("prompt", "Copied", "Save data copied to clipboard.");
            }).catch((e) => {
                popup = callPopup("prompt", "Error", "There was an error trying to copy your save string into the clipboard.");
                popup.$content.insertAdjacentHTML("afterend", `
                    <p>You can still manually copy your save string from the text box by selecting all the text and copy it.
                `)
            })
        }
        actionGroup.append(btn);
        btn = $make("button.primary", "Download File");
        btn.onclick = () => {
            awardBadge(24);
            let blob = new Blob([LZString.compressToUint8Array(JSON.stringify(game))], { type: "octet/stream" });
            let a = $make("a");
            a.href = URL.createObjectURL(blob);
            a.download = "1tFreeDraws-" + Date.now() + ".e12.sav";
            a.click();
            callPopup("prompt", "Downloading save...", `Save data downloading as "${a.download}"...`);
        }
        actionGroup.append(btn);

        popup.$body.append(actionGroup = $make("div.action-group"));
        saveActions.append(actionGroup);
        btn = $make("button.danger", "Import from Text Box");
        btn.onclick = () => {
            let importData = null;
            try {
                importData = JSON.parse(LZString.decompressFromBase64(saveText.value));
                fixSave(importData, getNewGame());
            } catch {
                if (saveText.value.includes("...") || saveText.value.includes("…")) {
                    callPopup("prompt", "Invalid Save",
                        "Ellipsis detected in save string. Your save might have been truncated by the browser or the operating system. " +
                        "You can use the Download File option instead to make a more reliable backup.");
                }
                callPopup("prompt", "Invalid Save",
                    "This save appears to be incorrect or corrupted. " +
                    "Make sure you have copied the entire save string and the save string is not truncated.");
                return;
            }

            this.showImportPopup(importData);
        }
        actionGroup.append(btn);
        btn = $make("button.danger", "Upload File");
        btn.onclick = () => {
            let file = document.createElement("input");
            file.type = "file";
            file.accept = ".e12.sav";

            file.onchange = (e) => {
                let data = file.files[0];
                if (!data) return;
                let reader = new FileReader();
                reader.onloadend = (evt) => {
                    if (evt.target.readyState == FileReader.DONE) {
                        var arrayBuffer = evt.target.result,
                            array = new Uint8Array(arrayBuffer);

                        console.log(array, LZString.decompressFromUint8Array(array));

                        let importData = null;
                        try {
                            importData = JSON.parse(LZString.decompressFromUint8Array(array));
                            fixSave(importData, getNewGame());
                        } catch (e) {
                            console.log(e);
                            callPopup("prompt", "Invalid Save",
                                "This save appears to be incorrect or corrupted. " +
                                "Make sure you have copied the entire save string and the save string is not truncated.");
                            return;
                        }

                        this.showImportPopup(importData);
                    }
                }
                reader.readAsArrayBuffer(data);
            }

            file.click();
        }
        actionGroup.append(btn);

        return popup;
    },
    showImportPopup(importData, type = "") {
        let title = "Import this save?";
        let desc = "Would you like to import this save? Your current game will be overridden!";
        if (type == "cloudcheck") {
            title = "Older cloud save";
            desc = "The save on the cloud seems to be older than the current local save. Would you like to import the cloud save?";
        } if (type == "cloudavail") {
            title = "Cloud save available!";
            desc = "There is a cloud save available. Would you like to import it?";
        }

        let popup = callPopup("prompt", title, desc, {
            no: "No, go back",
            "": "",
            yes$primary: "Yes, import save"
        }, x => {
            if (x == "yes") {
                if (popup.querySelector("#keep-opt-checkbox").checked) importData.option = { ...game.option };
                saveGame = () => { return false; }
                callPopup("prompt", "Importing save...", "(the game will reload in a moment, don't close the game in the process)", {});
                localStorage.setItem(SAVE_KEY, LZString.compress(JSON.stringify(importData)));
                window.location.reload();
            }
        });

        popup.$content.insertAdjacentHTML("afterend", `
            <hr>
            <p>
                <div class="input-group">
                    <input type="checkbox" id="keep-opt-checkbox">
                    <label for="keep-opt-checkbox">Keep preferences</label>
                </div>
                <small class="unimportant">(Note: preferences that are bound to an unlockable will be changed to a different one
                if said unlockable is not present in the new save)</small>
            </p>
            <hr>
        `)

        let saveSummary = $make("div.formula.save-summary");
        popup.$content.insertAdjacentElement("afterend", saveSummary);
        function makeSummaryEntry(title, content) {
            let entry = $make("div", $make("span", title), $make("span.number", content));
            saveSummary.append(entry);
        }

        makeSummaryEntry("Time played:", format.time(importData.stats.timePlayed));
        makeSummaryEntry("Cards " + getVerb("drawn") + ":", format(importData.stats.cardsDrawn, 0, 13));
    }
}