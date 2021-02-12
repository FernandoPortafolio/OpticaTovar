const cloudinary = require('cloudinary').v2
const { CLOUDINARY } = require('./settings')

cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
})

module.exports = cloudinary
