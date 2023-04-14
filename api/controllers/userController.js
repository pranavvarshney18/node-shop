const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');



module.exports.user_signup = (req, res, next) => {
    //check if the email id does not already exists
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: 'Email already exists'
                });
            }
            else{
                //hash the password and create user
                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    if(err){
                        return res.status(500).json({
                            error : err  
                        });
                    }
                    else{
                        const user = new User ({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({error: err});
                            })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
        
};








module.exports.user_login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }

            //now email is correct, now check for password
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Authorization failed'
                    });
                }

                if(result == true){
                    //to generate a token
                    const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, 
                        process.env.JWT_KEY, /*private key, which is stored in environment variable which is located in the folder nodemon.js */
                        {
                            expiresIn: "1h"
                        }
                    );


                    return res.status(200).json({
                        message: 'Login successful',
                        token: token
                    });
                }
                else{
                    return res.status(401).json({
                        message: 'Authorization failed'
                    });
                }
            });
        }) 
        .catch(err => {
            res.status(500).json({error: err});
        })
};










module.exports.delete_user = (req, res, next) => {
    User.findByIdAndDelete(req.params.orderId)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error : err});
        });
};