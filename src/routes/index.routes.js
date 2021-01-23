const { Router } = require('express');
const router = Router();

//importing all routes
router.use(require('./navigation.routes'));
router.use('/api/products', require('./products.routes'));

module.exports = router;
