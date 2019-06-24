import http from './httpService';

export function getClothes() {
    return http.get(`/all-data`)
}

export function getClothesTypes() {
    return http.get(`/sort-word-type`)
}

export function getType(type, brand, price) {
    return fetch(`/filter/${type}/${brand}/${price}`, {
        method: 'GET'
    }).then(function (response) {
        if (response.ok) {
            console.log('success')
            return response.json();
        } else {
            console.log('fail')
            return false
        }
    })
}
