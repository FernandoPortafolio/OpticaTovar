require('dotenv').config()
module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  SECRET: process.env.JWT_SECRET || 'somesecrettoken',
  DB: {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST || 'localhost',
    PORT: process.env.DB_PORT,
    DATABASE: process.env.DATABASE,
  },
  EMAIL_CREDENTIALS: {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
  },
}
