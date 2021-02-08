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

module.exports = {
  isActive,
  isSelected,
  addIndex,
  formatDate,
  isRequired,
}
