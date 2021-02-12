const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + path.extname(file.originalname))
  },
})

module.exports = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const validExtensions = ['.png', '.jpeg', '.jpg', '.gif']
    const ext = path.extname(file.originalname)

    if (validExtensions.includes(ext)) {
      callback(null, true)
    } else {
      console.log('The image has not been accepted')
      console.log(file)
      callback(null, false)
    }
  },
}).single('foto')
