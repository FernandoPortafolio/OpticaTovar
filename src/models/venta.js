const { connect } = require('../config/database')
const cliente = require('./cliente')
const uniqid = require('uniqid')
class Venta {
  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT v.*, concat(c.nombre, ' ', c.apellido) as cliente  
    from venta v
    LEFT JOIN cliente c on c.id_cliente = v.id_cliente`
    const result = await conn.query(sql)
    conn.end()
    return result
  }

  async findOneById(id_venta) {
    const conn = await connect()
    const sql = 'SELECT * from venta where id_venta = ?'
    const result = await conn.query(sql, [id_venta])
    conn.end()
    return result[0]
  }

  async createVentaTienda(venta, productos) {
    const conn = await connect()
    conn.beginTransaction()
    try {
      //Insertar una venta
      let sql =
        'INSERT INTO venta(id_venta, fecha, id_cliente, status, tipo) VALUES (?,?,?,?,?)'
      await conn.query(sql, [
        venta.id_venta,
        venta.fecha,
        venta.id_cliente,
        venta.status,
        'Manual',
      ])

      //disminuir el inventario de los productos vendidos
      sql = 'UPDATE inventario set stock = stock - ? where id_producto = ?'
      for (const producto of productos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      //insertar en la tabla los productos vendidos
      sql =
        'INSERT INTO venta_detalle(id_venta, id_producto, cantidad) VALUES (?,?,?)'
      for (const producto of productos) {
        await conn.query(sql, [
          venta.id_venta,
          producto.id_producto,
          producto.cantidad,
        ])
      }

      conn.commit()
    } catch (error) {
      console.log(error)
      conn.rollback()
    }
    conn.end()
  }

  async createVentaPaypal(venta, client, productos) {
    const conn = await connect()
    conn.beginTransaction()
    let success = false
    try {
      //crear un cliente si no existe
      const existCliente = cliente.findOneById(client.id_cliente)
      if (!existCliente && client.id_cliente !== undefined) {
        await cliente.createCliente(client, false, conn)
      }

      //insertar una venta
      let sql =
        'INSERT INTO venta(id_venta, fecha, id_cliente, status, tipo) VALUES (?,?,?,?,?)'
      await conn.query(sql, [
        venta.id_venta,
        venta.fecha,
        client.id_cliente,
        venta.status,
        venta.tipo,
      ])

      //Disminuir el inventario de los productos vendidos
      sql = 'UPDATE inventario set stock = stock - ? where id_producto = ?'
      for (const producto of productos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      //insertar en la tabla los productos vendidos
      sql =
        'INSERT INTO venta_detalle(id_venta, id_producto, cantidad) VALUES (?,?,?)'
      for (const producto of productos) {
        await conn.query(sql, [
          venta.id_venta,
          producto.id_producto,
          producto.cantidad,
        ])
      }

      conn.commit()
      success = true
    } catch (error) {
      console.log(error)
      conn.rollback()
    }
    conn.end()
    return success
  }

  async modifyVenta(venta, productos) {
    const conn = await connect()
    conn.beginTransaction()
    try {
      //Modificar una venta
      let sql = 'UPDATE venta set fecha = ?, id_cliente = ? where id_venta = ?'
      await conn.query(sql, [venta.fecha, venta.id_cliente, venta.id_venta])

      //Consultar cuales eran los productos que tenia esa venta
      sql = `SELECT id_producto, cantidad
            from venta_detalle vd
            WHERE id_venta = ?`
      const productosAntiguos = await conn.query(sql, [venta.id_venta])

      //sumar del inventario todos los productos viejos, porque se van a eliminar y volver a insertar los nuevos
      sql = 'UPDATE inventario set stock = stock + ? where id_producto = ?'
      for (const producto of productosAntiguos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      //borrar los productos de la venta
      sql = 'DELETE from venta_detalle where id_venta = ?'
      await conn.query(sql, [venta.id_venta])

      //volver a insertar los nuevos productos actualizados
      sql =
        'INSERT INTO venta_detalle(id_venta, id_producto, cantidad) VALUES (?,?,?)'
      for (const producto of productos) {
        await conn.query(sql, [
          venta.id_venta,
          producto.id_producto,
          producto.cantidad,
        ])
      }

      //Modificar el inventario de cada producto y restarle las nuevas cantidades
      sql = 'UPDATE inventario set stock = stock - ? where id_producto = ?'
      for (const producto of productos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      conn.commit()
    } catch (error) {
      console.log(error)
      conn.rollback()
    }
    conn.end()
  }

  async deleteVenta(id_venta) {
    const conn = await connect()
    conn.beginTransaction()
    try {
      //Consultar cuales eran los productos que tenia esa venta
      let sql = `SELECT id_producto, cantidad
       from venta_detalle vd
       WHERE id_venta = ?`
      const productosAntiguos = await conn.query(sql, [id_venta])

      //sumar del inventario todos los productos viejos, porque se van a eliminar y volver a insertar los nuevos
      sql = 'UPDATE inventario set stock = stock + ? where id_producto = ?'
      for (const producto of productosAntiguos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      //borrar la venta
      sql = 'DELETE from venta where id_venta = ?'
      await conn.query(sql, [id_venta])
      conn.commit()
    } catch (error) {
      console.log(error)
      conn.rollback()
    }
    conn.end()
  }

  async getSaleProducts(id_venta) {
    const conn = await connect()
    const sql = `SELECT vd.id_producto, vd.cantidad, p.precio, p.descripcion
    from venta_detalle vd
    JOIN producto p USING (id_producto)
    WHERE id_venta = ?`
    const result = await conn.query(sql, [id_venta])
    conn.end()
    return result
  }

  generateID() {
    return uniqid().substring(0, 17).toUpperCase()
  }
}

module.exports = new Venta()
