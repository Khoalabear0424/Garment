import http from './httpService';
import { apiUrl } from '../config.json'

export function getClothes() {
    return http.get(`${apiUrl}/all-data`)
}

export function getClothesTypes() {
    return http.get(`${apiUrl}/sort-word-type`)
}

export function getType(type, brand, price) {
    return fetch(`${apiUrl}/filter/${type}/${brand}/${price}`, {
        method: 'GET'
    }).then(function (response) {
        if (response.ok) {
            console.log('success')
            console.log(response)
            return response.json();
        } else {
            console.log('fail')
            return false
        }
    })
}
