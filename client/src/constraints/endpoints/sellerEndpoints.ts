export const BASE_URL = 'http://localhost:3000/api/seller';

export const sellerEndpoints = {
    register: `${BASE_URL}/register`,
    otp:  `${BASE_URL}/otp`,
    resendOtp: `${BASE_URL}/resend-otp`,
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
    addProduct: `${BASE_URL}/addproduct`,
    getCategory: `${BASE_URL}/getCategory`,
    getProducts: `${BASE_URL}/getProducts`,
    blockProduct: `${BASE_URL}/blockProduct`,
    editProduct: `${BASE_URL}/editProduct`,

}