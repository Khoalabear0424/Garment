import http from './httpService';

export function getClothes() {
    return http.get('http://localhost:3001/all-data')
}