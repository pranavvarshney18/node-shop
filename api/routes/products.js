const express = require('express');
const router = express.Router();


//to upload file, we use form data which is parsed through multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        //accept the file
        callback(null, true);
    }
    else{
        //reject the file
        callback(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //files upto 5mb will be accepted only
    },
    fileFilter: fileFilter
}); 


const checkAuth = require('../middlewares/check_auth');
const productsController = require('../controllers/productsController');


router.get('/', productsController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), productsController.create_product);

router.get('/:productID', productsController.get_specific_product);

router.patch('/:productID', checkAuth, productsController.update_product);


router.delete('/:productID', checkAuth, productsController.delete_product);



module.exports = router;