module.exports = function(app, db) {
    
    const objectID = require('mongodb').ObjectID;
    
    const clnUsers = "clnUsers";
    const clnBooks = "clnBooks";
    const clnAccounts = "clnAccounts";
    const clnTrans = "clnTransactions";

    function handleError(res, reason, message, code) {
        console.log("Error " + reason);
        res.status(code || 500).json({
            "message": message,
            "reason": reason,
            "code":code
        });
    }

    

    app.post('/createnewaccount', function(req,res){
        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountName))) {
            return handleError(res, "Invalid Data", "New Account's Data Missing");
        } else {
            var newAccountUserId = req.body.userId;
            var newAccountBookId = req.body.bookId;
            var newAccountName = req.body.accountName;

            db.collection(clnAccounts).findOne({ ownerId:newAccountUserId, accountName:newAccountName, bookId:newAccountBookId }, function(err, dbRes){
                if(err) {
                    handleError(err, err.message, "DB Error Checking If Book Already Exists")
                } else {
                    if(dbRes === null) {
                        newAccountSubmitObject = { ownerId:newAccountUserId, bookId:newAccountBookId, accountName:newAccountName, transactions: [], notes: [] }
                        db.collection(clnAccounts).insertOne(newAccountSubmitObject, function(err, resFromDb){
                            if(err) {
                                handleError(err, err.message, "DB-Error Adding New Book To Database");
                            } else {
                                res.json({ status:200 })
                            }
                        });
                    } else {
                        res.send({ msg:"This book name is already taken", status:409 });
                    }
                }
            });
        }
    }); //End New Accout Post

    
    app.post('/fetchallaccounts', function(req,res){
        var userId = req.body.userId;
        var bookId = req.body.bookId;

        if((!(req.body.userId)) || (!(req.body.bookId))) {
            handleError(res, "Invalid Data", "UserID and/or BookID Missing in Request")
        } else {
            accountQueryObj = { ownerId: userId, bookId: bookId }
            db.collection(clnAccounts).find(accountQueryObj).toArray(function(err, allAccounts){
                if(err) {
                    handleError(err, err.message, "DB-Error finding all accounts based on bookid and userid")
                } else {
                    
                    db.collection(clnBooks).findOne({ _id: objectID(bookId) }, { bookName:1 } , function(err, bookNameObj){
                        if(err) {
                            handleError(err, err.message, "DB Error finding bookdata");
                        } else {
                            res.json({
                                status:200,
                                bookName:bookNameObj.bookName,
                                data:allAccounts
                            });
                        }
                    });

                    
                }
            });
        }
    });//End READ Accounts POST

    
    app.post('/editaccount', function(req,res){
        var userId = req.body.userId;
        var bookId = req.body.bookId;
        var editAccountObjId = objectID(req.body.editAccountId);

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.editAccountId)) || (!(req.body.formData))) {
            return handleError(res, "Invalid Data", "UserID or BookID missing", 400);
        }

        db.collection(clnAccounts).findOne({ ownerId:userId, accountName: req.body.formData.editAccountName }, function(err, dbRes){
            if(err) {
                handleError(err, err.message, "DB Error Checking If Book Already Exists")
            } else { 
                if(dbRes === null) {
                    accountFindQuery = { ownerId:userId, bookId: bookId, _id:editAccountObjId };
                    db.collection(clnAccounts).updateOne(accountFindQuery,
                        { $set : { accountName: req.body.formData.editAccountName }},
                        function(err, dbres){
                            if(err) {
                                return handleError(err, err.message, "DB Error Editing Account")
                            } else {
                                return res.json({ status:200 });
                            }
                        });
                } else {
                    res.send({ msg:"This book name is already taken", status:409 });
                }
            }
        });

    });//End EDIT Account POST


    app.post('/deleteaccount', function(req,res){
        var userId = req.body.userId;
        var bookId = req.body.bookId;
        var accountObjId = objectID(req.body.deleteAccountId);

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.deleteAccountId))) {
            return handleError(res, "Invalid Data", "UserID or BookID missing", 400);
        }

        accountQueryObj = { ownerId:userId, bookId:bookId, _id:accountObjId }
        db.collection(clnAccounts).deleteOne(accountQueryObj, function(err, dbRes){
            if(err) {
                return handleError(err, err.message, "DB Error Deleting Account")
            } else {
                return res.json({ status:200 });
            }
        });
    }); //End DELETE Account POST



}