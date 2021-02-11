const { connect } = require('../config/database')
const uniqid = require('uniqid')
class Compra {
  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT c.*, p.razon_social 
                FROM compra c
                LEFT JOIN proveedor p USING(id_proveedor)`
    const result = await conn.query(sql)
    //conn.end()
    return result
  }

  async readOneById(id_compra) {
    const conn = await connect()
    const sql = 'SELECT * from compra where id_compra = ?'
    const compra = await conn.query(sql, [id_compra])
    //conn.end()
    return compra[0]
  }

  async createCompra(compra, productos) {
    const conn = await connect()
    conn.beginTransaction()
    try {
      //insertar una compra
      let sql = 'INSERT INTO compra(folio, fecha, id_proveedor) VALUES (?,?,?)'
      let result = await conn.query(sql, [
        compra.folio,
        compra.fecha,
        compra.id_proveedor,
      ])

      const insertId = result.insertId

      //insertar los detalles de la compra. 1 registro por producto
      sql =
        'INSERT INTO compra_detalle(id_compra, id_producto, cantidad, precio_proveedor) VALUES (?,?,?,?)'
      for (const producto of productos) {
        await conn.query(sql, [
          insertId,
          producto.id_producto,
          producto.cantidad,
          producto.precio,
        ])
      }

      //Aumentar el inventario de cada producto
      sql = 'UPDATE inventario set stock = stock + ? where id_producto = ?'
      for (const producto of productos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      conn.commit()
    } catch (error) {
      console.log(error)
      conn.rollback()
    }
    //conn.end()
  }

  async modifyCompra(compra, productos) {
    const conn = await connect()
    conn.beginTransaction()
    try {
      //modificar una compra
      let sql =
        'UPDATE compra set fecha = ?, id_proveedor = ? where id_compra = ?'
      await conn.query(sql, [
        compra.fecha,
        compra.id_proveedor,
        compra.id_compra,
      ])

      //consultar cuales eran los productos que tenia esa compra
      sql = `SELECT id_producto, cantidad
      from compra_detalle cd
      WHERE id_compra = ?`
      const productosAntiguos = await conn.query(sql, [compra.id_compra])

      //restar del inventario todos los productos viejos, porque se van a eliminar y volver a insertar los nuevos
      sql = 'UPDATE inventario set stock = stock - ? where id_producto = ?'
      for (const producto of productosAntiguos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      //Borrar los productos de la compra
      sql = 'DELETE from compra_detalle where id_compra = ?'
      await conn.query(sql, [compra.id_compra])

      //volver a insertar los productos de la compra
      sql =
        'INSERT INTO compra_detalle(id_compra, id_producto, cantidad, precio_proveedor) VALUES (?,?,?,?)'
      for (const producto of productos) {
        await conn.query(sql, [
          compra.id_compra,
          producto.id_producto,
          producto.cantidad,
          producto.precio,
        ])
      }

      //Modificar el inventario de cada producto y sumarle las nuevas cantidades
      sql = 'UPDATE inventario set stock = stock + ? where id_producto = ?'
      for (const producto of productos) {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      }

      conn.commit()
    } catch (error) {
      conn.rollback()
    }
    //conn.end()
  }

  async deleteCompra(id_compra) {
    const conn = await connect()
    conn.beginTransaction()
    try {
      //consultar cuales eran los productos que tenia esa compra
      let sql = `SELECT id_producto, cantidad
      from compra_detalle cd
      WHERE id_compra = ?`
      const productosAntiguos = await conn.query(sql, [id_compra])

      //restar del inventario todos los productos comprados
      sql = 'UPDATE inventario set stock = stock - ? where id_producto = ?'
      productosAntiguos.forEach(async (producto) => {
        await conn.query(sql, [producto.cantidad, producto.id_producto])
      })

      //borrar la compra
      sql = 'DELETE from compra where id_compra = ?'
      await conn.query(sql, [id_compra])

      conn.commit()
    } catch (error) {
      conn.rollback()
    }

    //conn.end()
  }

  async findProductosCompra(id_compra) {
    const conn = await connect()
    const sql = `SELECT cd.id_producto, cd.cantidad, cd.precio_proveedor, p.descripcion
    from compra_detalle cd
    JOIN producto p USING (id_producto)
    WHERE id_compra = ?`
    const result = await conn.query(sql, [id_compra])
    //conn.end()
    return result
  }

  generateFolio() {
    return uniqid().substring(0, 16).toUpperCase()
  }
}

module.exports = new Compra()
