function isActive(currentPage, page) {
  return currentPage === page ? 'active' : ''
}
function isSelected(val1, val2) {
  return val1 == val2 ? 'selected' : ''
}
function isRequired(object) {
  return object === null || object === undefined ? 'required' : ''
}

function addIndex(array) {
  let counter = 1
  for (element of array) {
    element.index = counter++
  }
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function getUserImageUrl(url) {
  if (url === null) {
    return 'https://res.cloudinary.com/dnurqqdri/image/upload/v1613102565/optica/usuarios/no-user-photo_lc0gev.jpg'
  }
  return url
}

function getProductImageUrl(url) {
  if (url === null) {
    return 'https://res.cloudinary.com/dnurqqdri/image/upload/v1613102591/optica/productos/no-foto_mmzejz.jpg'
  }
  return url
}

module.exports = {
  isActive,
  isSelected,
  addIndex,
  formatDate,
  isRequired,
  getUserImageUrl,
  getProductImageUrl,
}
