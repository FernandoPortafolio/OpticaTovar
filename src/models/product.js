const { connect } = require('../config/database')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

class Product {
  async fetchAll() {
    const conn = await connect()
    const sql = `
    SELECT p.*, pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  m.marca, c.categoria, f.forma, ta.tipo_armazon, pd.foto, pd.foto_public_id  
    from producto p
    LEFT JOIN producto_detalle pd on p.id_producto = pd.id_producto
    LEFT JOIN marca m on m.id_marca = p.id_marca
    LEFT JOIN categoria c on c.id_categoria = p.id_categoria
    LEFT JOIN forma f on f.id_forma = p.id_forma
    LEFT JOIN tipo_armazon ta on ta.id_tipo_armazon = p.id_tipo_armazon
    `
    const products = await conn.query(sql)
    //conn.end()
    return products
  }

  async findOneByID(id_producto) {
    const conn = await connect()
    const sql = `
    SELECT p.*, 
    pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  
    m.marca, c.categoria, f.forma, ta.tipo_armazon, i.stock, pd.foto, pd.foto_public_id  
    from producto p
    LEFT JOIN producto_detalle pd on p.id_producto = pd.id_producto
    LEFT JOIN marca m on m.id_marca = p.id_marca
    LEFT JOIN categoria c on c.id_categoria = p.id_categoria
    LEFT JOIN forma f on f.id_forma = p.id_forma
    LEFT JOIN tipo_armazon ta on ta.id_tipo_armazon = p.id_tipo_armazon
    LEFT JOIN inventario i on i.id_producto = p.id_producto
    WHERE p.id_producto = ?
    `
    const product = await conn.query(sql, [id_producto])
    //conn.end()
    return product[0]
  }

  async createProduct(product, foto) {
    const conn = await connect()
    conn.beginTransaction()
    let upload
    try {
      //insertar en la tabla de productos
      let sql =
        'INSERT INTO producto(precio, descripcion, id_tipo_armazon, id_marca, id_categoria, id_forma) VALUES (?,?,?,?,?,?)'
      let result = await conn.query(sql, [
        product.precio,
        product.descripcion,
        product.id_tipo_armazon,
        product.id_marca,
        product.id_categoria,
        product.id_forma,
      ])
      const insertId = result.insertId

      //insertar en la tabla de detalle de producto
      upload = await uploadImage(foto)
      sql =
        'INSERT INTO producto_detalle(id_producto, color, talla, longitud_varilla, ancho_puente, ancho_total, sku, foto, foto_public_id) VALUES (?,?,?,?,?,?,?,?,?)'
      await conn.query(sql, [
        insertId,
        product.color,
        product.talla,
        product.longitud_varilla,
        product.ancho_puente,
        product.ancho_total,
        product.sku,
        upload.url,
        upload.public_id,
      ])

      //insertar en inventario 0 unidades
      sql = 'INSERT INTO inventario(id_producto, stock) VALUES (?,?)'
      await conn.query(sql, [insertId, 0])

      conn.commit()
    } catch (error) {
      conn.rollback()
      console.log(error)
      deleteImage(foto)
    }

    //conn.end()
  }

  async modifyProduct(product, foto) {
    const conn = await connect()
    conn.beginTransaction()

    let upload
    try {
      const old = await this.findOneByID(product.id_producto)
      //insertar en la tabla de productos
      let sql =
        'UPDATE producto SET precio = ?,descripcion = ?,id_tipo_armazon = ?,id_marca = ?,id_categoria = ?,id_forma = ? WHERE id_producto = ?'
      await conn.query(sql, [
        product.precio,
        product.descripcion,
        product.id_tipo_armazon,
        product.id_marca,
        product.id_categoria,
        product.id_forma,
        product.id_producto,
      ])

      //modificar en la tabla de detalle de producto
      upload = await uploadImage(foto)

      let params = [
        product.color,
        product.talla,
        product.longitud_varilla,
        product.ancho_puente,
        product.ancho_total,
        product.sku,
        product.id_producto,
      ]
      if (upload.ok) {
        sql =
          'UPDATE producto_detalle SET color=?, talla=?, longitud_varilla=?, ancho_puente=?, ancho_total=?, sku=?, foto = ?, foto_public_id = ? WHERE id_producto = ?'
        params.splice(6, 0, upload.url, upload.public_id)
      } else {
        sql =
          'UPDATE producto_detalle SET color=?, talla=?, longitud_varilla=?, ancho_puente=?, ancho_total=?, sku=? WHERE id_producto = ?'
      }

      await conn.query(sql, params)

      if (upload.ok) {
        deleteImage({ public_id: old.foto_public_id })
      }

      conn.commit()
    } catch (error) {
      conn.rollback()
      console.log(error)
      deleteImage(foto)
    }

    //conn.end()
  }

  async deleteProduct(id_producto) {
    const old = await this.findOneByID(id_producto)
    try {
      const sql = 'DELETE from producto where id_producto = ?'
      const conn = await connect()
      await conn.query(sql, [id_producto])
      deleteImage({ public_id: old.foto_public_id })
    } catch (error) {
      console.log(error)
    }
  }

  async getInventario() {
    const sql = `
    SELECT i.*, p.descripcion, pd.foto 
        FROM inventario i
        JOIN producto p on p.id_producto = i.id_producto
        JOIN producto_detalle pd on pd.id_producto = p.id_producto
        order by i.stock desc
      `
    const conn = await connect()
    const result = await conn.query(sql)
    //conn.end()
    return result
  }

  async getStock(id_producto) {
    const conn = await connect()
    const sql = `SELECT stock from inventario where id_producto = ?`
    let stock = await conn.query(sql, [id_producto])
    //conn.end()
    return stock[0]?.stock
  }

  async showPaginate(p_page, p_orderBy, p_filter) {
    const conn = await connect()

    //datos de las paginas
    const pageSize = 9
    const page = p_page || 1
    const start = page ? (page - 1) * pageSize : 0

    //criterio de ordenacion
    const orderBy = mapOrderBy(parseInt(p_orderBy))

    //filtro de categoria
    const where =
      p_filter && p_filter != 0 ? ` where p.id_categoria = ${p_filter} ` : ''

    let sql = `
    SELECT p.*, pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  m.marca, c.categoria, f.forma, ta.tipo_armazon, COALESCE(pd.foto, 'https://res.cloudinary.com/dnurqqdri/image/upload/v1613102591/optica/productos/no-foto_mmzejz.jpg') as foto  
    from producto p
    LEFT JOIN producto_detalle pd on p.id_producto = pd.id_producto
    LEFT JOIN marca m on m.id_marca = p.id_marca
    LEFT JOIN categoria c on c.id_categoria = p.id_categoria
    LEFT JOIN forma f on f.id_forma = p.id_forma
    LEFT JOIN tipo_armazon ta on ta.id_tipo_armazon = p.id_tipo_armazon
    ${where}
    ${orderBy}
    `

    //encontrar el total de productos sin paginar la busqueda
    let result = await conn.query(sql)
    const totalProducts = result[0].length
    const totalPages = Math.ceil(totalProducts / pageSize)

    //paginar la busqueda
    sql += ` LIMIT ${start}, ${pageSize}`
    const items = await conn.query(sql)
    //conn.end()

    return {
      page: parseInt(page),
      totalProducts,
      totalPages,
      start: start + 1,
      end: start + pageSize,
      pageSize,
      items,
    }
  }

  async getProductsPerFace(face) {
    let sql = `SELECT p.id_producto, p.descripcion, m.marca, c.categoria, f.forma, ta.tipo_armazon, pd.foto 
    from producto p
    JOIN producto_detalle pd on p.id_producto = pd.id_producto
    JOIN marca m on m.id_marca = p.id_marca
    JOIN categoria c on c.id_categoria = p.id_categoria
    JOIN forma f on f.id_forma = p.id_forma
    JOIN tipo_armazon ta on ta.id_tipo_armazon = p.id_tipo_armazon`

    switch (face) {
      case 'cuadrada':
        sql += " WHERE f.forma in ('Redondo', 'Lagrima')"
        break
      case 'rectangular':
        sql += " WHERE f.forma in ('Cuadrada', 'Lagrima', 'Aviador')"
        break

      case 'ovalada':
        sql += " WHERE ta.tipo_armazon in ('Acetato', 'Metalico')"
        break

      case 'redonda':
        sql += " WHERE f.forma in ('Cuadrada')"
        break

      case 'triangular':
        sql += " WHERE ta.tipo_armazon in ('Ranurado', 'Volado')"
        break

      case 'diamante':
        sql += " WHERE f.forma in ('Cuadrada')"
        break

      case 'corazon':
        sql += " WHERE f.forma in ('Redondo')"
        break
    }

    sql +=
      " and c.categoria not in ('Accesorios', 'Lentes de Seguridad') ORDER BY rand() LIMIT 4"
    const conn = await connect()
    const products = await conn.query(sql)
    //conn.end()
    return products
  }

  async getSalesByMonth() {
    const conn = await connect()
    const sql = `SELECT
    month(fecha) AS mes,
    COUNT(*) AS ventas
    FROM venta
    WHERE YEAR(fecha) = ${new Date().getFullYear()}
    GROUP BY month(fecha)
    ORDER BY month(fecha)`
    const sales = conn.query(sql)
    //conn.end()
    return sales
  }

  async getSalesByPlace() {
    const conn = await connect()
    let sql = `SELECT COUNT(*) as ventas from venta where tipo like 'Paypal' and status like 'COMPLETED'`
    const paypalSales = await conn.query(sql)

    sql = `SELECT COUNT(*) as ventas from venta where tipo like 'Manual' and status like 'COMPLETED'`
    const storeSales = await conn.query(sql)

    //conn.end()
    return {
      sales_store: paypalSales,
      sales_page: storeSales,
    }
  }
}

function mapOrderBy(orderBy) {
  switch (orderBy) {
    case 1:
      return ' order by precio asc '

    case 2:
      return ' order by precio desc '

    case 3:
      return ' order by marca asc '

    case 4:
      return ' order by marca desc '

    default:
      return ' order by id_producto '
  }
}

async function uploadImage(foto) {
  if (!foto) return { ok: false }

  try {
    const result = await cloudinary.uploader.upload(foto.path, {
      folder: 'optica/productos',
    })
    console.log('Imagen Subida a Cloudinary')
    console.log(result)
    fs.unlinkSync(foto.path)
    return {
      ok: true,
      url: result.url,
      public_id: result.public_id,
    }
  } catch (error) {
    console.error(error)
  }

  return { ok: false }
}

async function deleteImage(foto) {
  if (foto.public_id === undefined || foto.public_id === null) return
  try {
    const result = await cloudinary.uploader.destroy(foto.public_id)
    console.log('Foto Eliminada de Cloudinary: ', foto.public_id)
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}

module.exports = new Product()
