const { connect } = require('../config/database');

class Category {
  async getCAtegories() {
    const conn = await connect();
    const sql = `SELECT * from categoria`;
    const categories = await conn.query(sql);
    conn.end();
    return categories[0];
  }
}

module.exports = Category; 