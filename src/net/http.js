import axios from 'axios'

const httpRequest=axios.create()
httpRequest.defaults.baseURL="http://127.0.0.1:8108"
httpRequest.defaults.headers.post["Content-Type"]="application/json"

export default httpRequest