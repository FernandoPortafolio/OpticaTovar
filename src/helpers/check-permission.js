function verifyPermission(user, permission) {
  let hasPermision = user.permisos.find((p) => p.permiso == permission)
  return hasPermision !== undefined
}

module.exports = {
  verifyPermission,
}
