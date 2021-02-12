function verifyPermission(user, permission) {
  //TODO quitar esto solo es provisional
  if (process.env.NODE_ENV === 'dev') return true
  let hasPermision = user.permisos.find((p) => p.permiso == permission)
  return hasPermision !== undefined
}

module.exports = {
  verifyPermission,
}
