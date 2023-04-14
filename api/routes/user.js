const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check_auth');
const userController = require('../controllers/userController');

router.post('/signup', userController.user_signup);


const User = require('../models/user');
router.get('/accessAllUsers', (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            res.status(200).json({users: users});
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
});



router.post('/login', userController.user_login);

router.delete('/:orderId', checkAuth, userController.delete_user);

module.exports = router;