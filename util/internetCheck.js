const internetConnectionCheck = async () => {
    await new Promise((resolve, reject) => {
        try {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "http://comci.kr/st")
            xhr.send()
            xhr.onload = () => {
                console.log(xhr)
                xx = xhr;
                console.log(xhr.status, xhr.statusText, xhr.status == 200)
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