const express = require('express');
const app = express();
//logging package -> will tell info of req in terminal
const morgan = require('morgan');
//req body parser
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.qhpki6p.mongodb.net/?retryWrites=true&w=majority');



//use logging package before using routes
app.use(morgan('dev'));
//making uploads folder public so that it can be accessed anywhere
app.use('/uploads', express.static('uploads'));
//parser
app.use(bodyParser.urlencoded({extended: false})); //true allows me to parse extended bodies with rich data in it
app.use(bodyParser.json());


//handling cors-error access
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//making an error incase no request matches to the given ones
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//if any error is generated, be it our own made custom error or error due to some other reason, we will handle it
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
});


module.exports = app;

