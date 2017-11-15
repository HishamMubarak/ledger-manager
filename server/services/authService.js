module.exports = function(app, db) {
    
    const crypto = require('crypto')
    const express = require('express');
    const jwt    = require('jsonwebtoken');
    const config = require('../config/dbConfig');

    const jwtSecret = config.secret;
    const clnUsers = "clnUsers";

    function handleError(res, reason, message, code) {
        console.log("Error " + reason);
        res.status(code || 500).json({
            "message": message,
            "reason": reason,
            "code":code
        });
    };

    var setPassword = function(password) {
        salt = crypto.randomBytes(16).toString('hex');
        hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
        return { salt: salt, hash: hash };
    };

    var validPassword = function(password, foundUser) {
        hash = crypto.pbkdf2Sync(password, foundUser.salt, 1000, 64, 'sha1').toString('hex');
        return foundUser.hash === hash;
    };

    app.post('/signup', function(req,res){
        
        var signupData = req.body;

        if((!(signupData.email)) || (!(signupData.password)) || (!(signupData.firstName)) || (!(signupData.lastName))) {
            handleError(res, "Invalid Data", "Missing Signup Data Field Values", 400)
        } else {
            db.collection(clnUsers).findOne({ email: signupData.email }, function(err, checkObj) {
                if(err) {
                    handleError(res, err.message, "Signup User Check Failed : DB Error")
                } else {
                    console.log(checkObj);
                    if(checkObj === null) {
                        var passObj = setPassword(signupData.password);
                        var newUserDataObj = { email: signupData.email, salt: passObj.salt, hash: passObj.hash, firstName: signupData.firstName, lastName: signupData.lastName };
                        db.collection(clnUsers).insertOne(newUserDataObj, function(err, doc){
                            if(err) {
                                handleError(res, err.message, "Failed-adding-new-user: DB Error");
                            } else {
                                addedUser = doc.ops[0];
                                delete addedUser.salt;
                                delete addedUser.hash;

                                var token = jwt.sign(addedUser, jwtSecret);
                                res.json({
                                    status: 200, 
                                    message: "User successfully Signed up",
                                    token: token,
                                });
                            }
                        });
                    } else {
                        res.send({ msg: "User with this email already exists", status: 0 });
                    }
                }
            });
        }
    }); // End Signup Post


    app.post('/login', function(req,res){
        
        var loginData = req.body;

        if((!(loginData.email)) || (!(loginData.password))) {
            handleError(res, "Invalid Data", "Email or password missing", 400);
        } else {
            db.collection(clnUsers).findOne({ email: loginData.email }, function(err, foundUser){
                if(err) {
                    handleError(res, err, "Finding-user-failed : DB Error")
                } else {
                    if(foundUser === null) {
                        res.send({msg:"User not found, please register", status: 0 });
                    } else {
                        if(validPassword(loginData.password, foundUser)) {
                            
                            delete foundUser.salt;
                            delete foundUser.hash;

                            var token = jwt.sign(foundUser, jwtSecret);

                            res.json({
                                status: 1,
                                message: "User successfully logged in",
                                token: token,
                            });

                        } else {
                            res.send({ msg: "Incorrect Credentials", status: 0 })
                        }
                    }
                }
            });
        }

        

    }); //End Login Route


} //End module exports