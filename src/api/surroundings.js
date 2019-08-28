import axios from 'axios'
import {baseURL} from "./config";

export function temperatureValue(data) {
    return axios({
        method: 'post',
        url: `${baseURL}/environment/humitureQuery`,
        params: data
    })
}
