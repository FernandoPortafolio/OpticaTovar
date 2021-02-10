function verifyPermission(user, permission) {
  let hasPermision = user.permisos.find((p) => p.permiso == permission)
  console.log('Has permission ', hasPermision !== undefined)
  return hasPermision !== undefined
}

module.exports = {
  verifyPermission,
}
