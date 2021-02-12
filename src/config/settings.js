require('dotenv').config()
module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: process.env.NODE_ENV,
  DOMAIN: process.env.DOMAIN,
  SECRET: process.env.JWT_SECRET || 'somesecrettoken',
  DB: {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT,
    DATABASE: process.env.DATABASE,
    DB_URL: process.env.CLEARDB_DATABASE_URL,
  },
  EMAIL_CREDENTIALS: {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
  },
  CLOUDINARY: {
    API_KEY: process.env.CLOUDDINARY_API_KEY,
    API_SECRET: process.env.CLOUDDINARY_API_SECRET,
    CLOUD_NAME: process.env.CLOUDINARY_NAME,
  },
}
