const { Router } = require('express')
const venta = require('../../models/venta')
const router = Router()

router.post('/create', async function (req, res) {
  const body = req.body
  console.log(body)
  const _venta = {
    id_venta: body.id_venta,
    fecha: body.fecha || undefined,
    status: body.status,
    tipo: 'Paypal',
  }

  const cliente = {
    id_cliente: body.id_cliente || undefined,
    email: body.email || undefined,
    nombre: body.nombre || undefined,
    apellido: body.apellido || undefined,
    calle: body.calle || undefined,
    colonia: body.colonia || undefined,
    ciudad: body.ciudad || undefined,
    cod_postal: body.cod_postal || undefined,
  }

  const productos = body.items || []
  const ok = await venta.createVentaPaypal(_venta, cliente, productos)
  if (ok) {
    res.json({
      ok,
      message: 'La venta se ha registrado con exito',
    })
  } else {
    res.json({
      ok,
      message: 'Ha habido un error al registrar la venta',
    })
  }
})

module.exports = router
