import dotenv from 'dotenv'
dotenv.config()

const config = {
    port : process.env.PORT || 3001,
    DB_URI : process.env.DB_URI || 'mongodb://localhost:27017/madras-company',
    EMAIL: process.env.EMAIL_NODEMAILER,
    EMAIL_PASSWORD: process.env.PASSWORD_NODEMAILER,
    SECRET_KEY: process.env.SECRET_KEY || 'jwt-secret-key',
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
    CORS_URL: process.env.CORS_URL
}

export default config