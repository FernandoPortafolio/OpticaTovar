const { connect } = require('../config/database');

class Product {
  async fetchAll() {
    const conn = connect();
    const sql = `
    SELECT p.*, pd.color, pd.talla, pd.longitud_varilla, pd.ancho_puente, pd.ancho_total, pd.sku,  m.marca, c.categoria, f.forma, ta.tipo_armazon, COALESCE(pd.foto, 'no-foto.jpg') as foto  
    from producto p
    LEFT JOIN producto_detalle pd on p.id_producto = pd.id_producto
    LEFT JOIN marca m on m.id_marca = p.id_marca
    LEFT JOIN categoria c on c.id_categoria = p.id_categoria
    LEFT JOIN forma f on f.id_forma = p.id_forma
    LEFT JOIN tipo_armazon ta on ta.id_tipo_armazon = p.id_tipo_armazon
    `;
    const products = await conn.query(sql);
    conn.end();
    return products[0];
  }

  async findOneByID(id_producto) {
    const conn = connect();
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
    `;
    const product = await conn.query(sql, [id_producto]);
    return product[0];
  }

  async getStock(id_producto) {
    const conn = connect();
    const sql = `SELECT stock from inventario where id_producto = ${id_producto}`;
    let stock = await conn.query(sql);
    stock = stock[0][0].stock;
    conn.end();
    return stock;
  }

  async showPaginate(p_page, p_orderBy, p_filter) {
    const conn = connect();

    //datos de las paginas
    const pageSize = 9;
    const page = p_page || 1;
    const start = page ? (page - 1) * pageSize : 0;

    //criterio de ordenacion
    const orderBy = mapOrderBy(parseInt(p_orderBy));

    //filtro de categoria
    const where =
      p_filter && p_filter != 0 ? ` where p.id_categoria = ${p_filter} ` : '';

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
    `;

    //encontrar el total de productos sin paginar la busqueda
    let result = await conn.query(sql);
    const totalProducts = result[0].length;
    const totalPages = Math.ceil(totalProducts / pageSize);

    //paginar la busqueda
    sql += ` LIMIT ${start}, ${pageSize}`;
    const items = await conn.query(sql);
    conn.end();

    return {
      page: parseInt(page),
      totalProducts,
      totalPages,
      start: start + 1,
      end: start + pageSize,
      pageSize,
      items: items[0],
    };
  }
}

function mapOrderBy(orderBy) {
  switch (orderBy) {
    case 1:
      return ' order by precio asc ';

    case 2:
      return ' order by precio desc ';

    case 3:
      return ' order by marca asc ';

    case 4:
      return ' order by marca desc ';

    default:
      return ' order by id_producto ';
  }
}

module.exports = Product;
