import axios from 'axios'

const HOST = "https://maimai.bakapiano.com"

const service = axios.create({
    baseURL: HOST,
    timeout: 1000 * 10,
})

service.interceptors.request.use(config => {
    return config
})


export default service
