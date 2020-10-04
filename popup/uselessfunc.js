
//const comci = "http://comci.kr:4081/st";

function getReqFromURL(url) {

    let getComciTab = () => {
        return new Promise((resolve, reject) => chrome.tabs.query({
            url: url
        }, (tabs) => {
            if (tabs === null || tabs.length < 1) {
                reject(errNoTab)
            }
            let tab = null;
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[0].id === null || tabs[0].id == "") {
                    if (i + 1 == tabs.length) {
                        reject(errNoID);
                    }
                    continue;
                }
                tab = tabs[i];
                if (tab === null) {
                    reject(errInvalidTab);
                }
                break;
            }
            resolve(tabs[0])
        }))
    }

    let newComciTab = () => {
        return new Promise((resolve, reject) => chrome.tabs.create({
            url: url
        }, (tab) => {
            if (tab === null) {
                reject(errNoTab)
            }
            if (tab.id === null || tab.id == "") {
                reject(errNoID)
            }
            resolve(tab)
        }));
    }

    let loaded = (tabId) => {
        chrome.runtime.onMessage.addListener((request, _) => {
            if (request.action == "getSource") {
                console.log(request.source)
            }
        })
        chrome.tabs.executeScript(tabId, {
            file: "popup/getComciHTML.js"
        }, () => {

        })
    }


    getComciTab().catch((e) => {
        switch (e) {
            case (errNoTab || errNoID):
                console.warn(e)
                newComciTab().then((tab) => {
                    loaded(tab.id)
                })
                break;

            default:
                console.error(e)
                break;
        }
    }).then((tab) => {
        loaded(tab.id)
    })
}