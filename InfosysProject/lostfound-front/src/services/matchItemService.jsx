import axios from 'axios';

const MATCH_URL = 'http://localhost:9595/lostfound/match';

// ================= SAVE / CLAIM MATCH =================
// Maps to: @PostMapping("/match") → service.updateLostFoundItems() + matchItemDao.saveMatchItem()
export const saveMatchItem = (matchItemDTO) => {
    return axios.post(MATCH_URL, matchItemDTO, {
        withCredentials: true
    });
}

// ================= GET ALL MATCHES =================
// Maps to: @GetMapping("/match") → matchItemDao.getAllMatchItems()
export const getAllMatchItems = () => {
    return axios.get(MATCH_URL, {
        withCredentials: true
    });
}
