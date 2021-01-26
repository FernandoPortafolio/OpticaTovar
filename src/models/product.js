const { connect } = require('../config/database')

class Product {
  async fetchAll() {
    const conn = await connect()
    const sql = `
    SELECT p.*, pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  m.marca, c.categoria, f.forma, ta.tipo_armazon, COALESCE(pd.foto, 'no-foto.jpg') as foto  
    from producto p
    LEFT JOIN producto_detalle pd on p.id_producto = pd.id_producto
    LEFT JOIN marca m on m.id_marca = p.id_marca
    LEFT JOIN categoria c on c.id_categoria = p.id_categoria
    LEFT JOIN forma f on f.id_forma = p.id_forma
    LEFT JOIN tipo_armazon ta on ta.id_tipo_armazon = p.id_tipo_armazon
    `
    const products = await conn.query(sql)
    conn.end()
    return products
  }

  async findOneByID(id_producto) {
    const conn = await connect()
    const sql = `
    SELECT p.*, 
    pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  
    m.marca, c.categoria, f.forma, ta.tipo_armazon, i.stock, COALESCE(pd.foto, 'no-foto.jpg') as foto  
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
    conn.end()
    return product[0]
  }

  async getStock(id_producto) {
    const conn = await connect()
    const sql = `SELECT stock from inventario where id_producto = ?`
    let stock = await conn.query(sql, [id_producto])
    conn.end()
    return stock[0]['stock']
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
    SELECT p.*, pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  m.marca, c.categoria, f.forma, ta.tipo_armazon, COALESCE(pd.foto, 'no-foto.jpg') as foto  
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
    conn.end()

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
    conn.end()
    return products
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

module.exports = new Product()
