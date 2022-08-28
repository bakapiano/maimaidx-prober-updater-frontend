import httpRequest from "../request/index"

async function postForm(username, password) {
    const result = await httpRequest.post("/auth", {username, password})
    return result
}

export {
    postForm
}