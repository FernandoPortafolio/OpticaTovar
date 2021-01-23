module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.JWT_SECRET || 'somesecrettoken',
  DB: {
    USER: process.env.DB_USER || 'empleado', 
    PASSWORD: process.env.DB_PASSWORD || '123456',
  },
};
