require('dotenv').config()
module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  SECRET: process.env.JWT_SECRET || 'somesecrettoken',
  DB: {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
  },
  EMAIL_CREDENTIALS: {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
  },
}
