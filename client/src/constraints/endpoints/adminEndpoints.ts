export const BASE_URL = 'http://localhost:3000/api/admin';

export const adminEndpoints = {
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
    fetchUsers: `${BASE_URL}/fetchusers`,
    fetchSellers: `${BASE_URL}/fetchsellers`,
    searchUser: `${BASE_URL}/searchuser`,
    searchSeller: `${BASE_URL}/searchseller`,
    blockUser: `${BASE_URL}/blockuser`,
    blockSeller: `${BASE_URL}/blockseller`,
    addCategory: `${BASE_URL}/addcategory`,
    fetchCategory: `${BASE_URL}/fetchcategory`,
    blockCategory: `${BASE_URL}/blockcategory`,
    addOffer: `${BASE_URL}/addOffer`,
    getOffer: `${BASE_URL}/getOffer`,
    blockOffer: `${BASE_URL}/blockOffer`
}