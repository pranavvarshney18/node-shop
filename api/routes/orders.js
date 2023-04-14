const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check_auth');
const ordersController = require('../controllers/ordersController');



router.get('/', checkAuth, ordersController.get_all_orders);

router.post('/', checkAuth, ordersController.create_order);

router.get('/:orderId', checkAuth, ordersController.get_specific_order);

router.delete('/:orderId', checkAuth, ordersController.delete_order);


module.exports = router;