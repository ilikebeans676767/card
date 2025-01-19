let popups = {};

function makePopup(...content) {
    let popup = $make("div.popup");

    let body = popup.$body = $make("div", ...content);
    popup.append(body);

    popup.close = () => {
        popup.classList.add("closing");
        setTimeout(() => popup.remove(), 200);
    }

    document.body.append(popup);
    return popup;
}

function callPopup(popup, ...args) {
    let popupd = popups[popup].call(...args);
    let close = popupd.close;
    popupd.close = () => {
        popups[popup].onClose?.();
        close();
    }
    return popupd;
}