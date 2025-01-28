let cloud = {};

function initCloud() {
    if (document.referrer.includes("https://galaxy.click")) {
        initGalaxyAPI();
    }
}

function initGalaxyAPI() {
    let requests = {};

    let send = (msg) => {
        let echo = Math.random();
        window.top.postMessage({
            ...msg,
            echo
        }, "https://galaxy.click");
        return new Promise((resolve) => {
            requests[echo] = resolve
        });
    }
    window.onmessage = (e) => {
        if (e.origin == "https://galaxy.click") {
            if (e.data?.echo) {
                requests[e.data.echo](e.data);
            }
        } else {
            console.log("hmmm", e.origin, e.data);
        }
    }

    cloud.type = "galaxy";
    cloud.send = send;
    cloud.listSaves = () => send({
        action: "save_list",
    })
}