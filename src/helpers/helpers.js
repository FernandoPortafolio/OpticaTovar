function isActive(currentPage, page) {
  return currentPage === page ? 'active' : ''
}
function isSelected(val1, val2) {
  return val1 === val2 ? 'selected' : ''
}

module.exports = {
  isActive,
  isSelected,
}
