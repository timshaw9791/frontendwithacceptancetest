import axios from 'axios'

let baseUrl = 'http://10.128.4.109:8088';


export function temperatureValue(data) {
    return axios({
        method: 'post',
        url: `${baseUrl}/environment/humitureQuery`,
        params: data
    })
}
