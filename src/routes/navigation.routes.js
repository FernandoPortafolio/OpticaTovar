const { Router } = require('express');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

const router = Router();

router.get('/', (req, res) =>
  res.render('index', {
    page: 'index',
  })
);

router.get('/contacto', (req, res) =>
  res.render('contacto', {
    page: 'contacto',
  })
);

router.get('/padecimientos', (req, res) =>
  res.render('padecimientos', {
    page: 'padecimientos',
  })
);

router.get('/faqs', (req, res) =>
  res.render('faqs', {
    page: 'faqs',
  })
);

router.get('/tienda', async (req, res) => {
  const category = new Category();
  const categories = await category.getCAtegories();
  res.render('tienda', {
    page: 'tienda',
    categories,
  });
});

router.get('/detalle-producto', async (req, res) => {
  const id_producto = req.query.id_producto;
  let product = new Product();
  product = await product.findOneByID(id_producto);

  res.render('detalle-producto', {
    page: 'detalle-producto',
    product: product[0],
  });
});

router.get('/pagar', (req, res) =>
  res.render('pagar', {
    page: 'pagar',
  })
);

module.exports = router;
