function isActive(currentPage, page) {
  return currentPage === page ? 'active' : '';
}

module.exports = {
  isActive,
};
