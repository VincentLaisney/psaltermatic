import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

function getLiturgy(date, SetLiturgy) {
    return axios.get(`${baseUrl}/liturgy`, {
        params: {
            date: date.toISOString().split('T')[0]
        }
    })
    .then(response => {
        SetLiturgy(response.data)
    })
}



export { getLiturgy }
