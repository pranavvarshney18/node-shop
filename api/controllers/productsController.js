const mongoose = require('mongoose');
const Product = require('../models/product');

module.exports.get_all_products = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
};



module.exports.create_product = (req, res, next) => {
    console.log(req.file); //req.file is available because of upload.single()
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    //save will store in database
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        });
    });
};




module.exports.get_specific_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        //if id is valid syntatically but is not present in the database, then it will return NULL, we will modify it
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            });
        }
        else{
            res.status(404).json({message: "No valid entry found for provided ID"})
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error : err});
    });
};




module.exports.update_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndUpdate(id, {$set: req.body}, {new: true})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request:{
                type: 'GET',
                description: 'Get updated product',
                url: 'http://localhost:3000/products/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    })
};








module.exports.delete_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndDelete(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted successfully',
            request: {
                type: 'POST',
                description: 'To create new product',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
    });
};