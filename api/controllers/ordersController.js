const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


module.exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            description: 'get this order',
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};






module.exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message : 'Product not found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
        
            return order.save()     
        })
        .then(doc => {
            // console.log(doc._id + "   " + doc.product + "      " + doc.quantity);
            return res.status(200).json({
                message: 'Order stored',
                createdOrder:{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity
                },
                request: {
                    type: 'GET',
                    message: 'To access the order',
                    url: 'http://localhost:3000/orders/' + doc._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};




module.exports.get_specific_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then(order => {
            if(!order){
                return res.status(404).json({
                    message : 'Order not found'
                });
            }

            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    description: 'Get all orders',
                    url: 'http://localhost:3000/orders'
                },
                getProduct: {
                    type: 'GET',
                    description: 'Get product',
                    url: 'http://localhost:3000/products/' + order.product
                }
            });
        })
        .catch(err => {
            res.status(500).json({error : err});
        })
};







module.exports.delete_order = (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
        .exec()
        .then(order => {
            if(!order){
                return res.status(404).json({
                    message: 'Given Order Id does not exist'
                });
            }

            res.status(200).json({
                message: 'Order deleted',
                details: order,
                request: {
                    type: 'POST',
                    description: 'To create new order',
                    url: 'http://localhost:3000/orders',
                    body: {productId: 'ID', quantity: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(500).json({error : err});
        });
};
