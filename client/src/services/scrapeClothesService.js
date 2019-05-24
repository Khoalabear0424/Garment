import http from './httpService';
import { apiUrl } from '../config.json'

export function getClothes() {
    return http.get(apiUrl + "/" + "all-data")
}

export function getClothesTypes() {
    return http.get(apiUrl + "/" + "sort-word-type")
}

export function getTops() {
    return http.get(apiUrl + "/" + "filter-tops")
}