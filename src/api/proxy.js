import httpRequest from "../request/index"

const proxyTestUrl = `https://maimai.wahlap.com/`

async function checkProxySettingStatus() {
    return new Promise((resolve, reject) => {
        fetch(proxyTestUrl, { 'mode': 'no-cors' },)
            .then(() => { resolve(false) })
            .catch((err) => {
                console.log(err)
                resolve(true)
            })
    })
}

export {
    checkProxySettingStatus
}
