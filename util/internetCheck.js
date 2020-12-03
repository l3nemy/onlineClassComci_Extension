const internetConnectionCheck = async () => {
    await new Promise((resolve, reject) => {
        try {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", comciInternalURL)
            xhr.send()
            xhr.onload = () => {
                xx = xhr;
                switch (xhr.status) {
                    case 0:
                        reject(new Error("Internet Not Connected"))
                        break;
                    case !200:
                        reject(new Error(`Request error (${xhr.statusText})`))
                        break;
                    case 200:
                        resolve()
                        break;
                    default:
                        reject(new Error("Unknown error"));
                }
                resolve()
            }
        } catch (e) {
            console.warn(e)
            reject(e)
        }
        resolve()
    })
}