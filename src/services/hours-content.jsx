import api from './api'

function getLiturgy(date, SetLiturgy) {
    return api.get(`/liturgy`, {
        params: {
            date: date.toISOString().split('T')[0]
        }
    })
    .then(response => {
        SetLiturgy(response.data)
    })
}



export { getLiturgy }
