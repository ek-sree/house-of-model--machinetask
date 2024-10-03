export const BASE_URL = 'http://localhost:3000/api';

export const userEndpoints = {
    register: `${BASE_URL}/register`,
    otp:  `${BASE_URL}/otp`,
    resendOtp: `${BASE_URL}/resend-otp`,
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
    fetchAllProducts: `${BASE_URL}/getAllProducts`,
    fetchSingleProduct: `${BASE_URL}/getSingleProduct`,
    getOfferUser: `${BASE_URL}/getOfferUser`
}