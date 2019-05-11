import http from './httpService';
import { apiUrl } from '../config.json'

export function getClothes() {
    return http.get(apiUrl + "/" + "all-data")
}