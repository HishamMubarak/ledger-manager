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


    app.post('/createnewbook', function(req,res){
        var newBookData = req.body;
        var bookName = newBookData.newBookName;
        var userId = newBookData.userId;

        if(!(userId) || (!(bookName))) {
            handleError(res, "Invalid Data", "User ID or New Book Name Missing in Request", 400);
        } else {
            userObjId = objectID(newBookData.userId);

            db.collection(clnUsers).findOne({ _id : userObjId }, function(err, userDataFromDb){
                if(err) {
                    handleError(res, "DB Error", "DB-Error-retrieving-user-data");
                } else {
                    if(userDataFromDb === null) {
                        res.send({msg:"No user found with this ID", status: 0})
                    } else {
                        db.collection(clnBooks).findOne({ ownerId: userId, bookName: bookName, activeFlag:1 }, function(err, dbRes){
                            if(err) {
                                handleError(err, err.message, "Error Checking Exists New Book");
                            } else {
                                if(dbRes == null) {
                                    var newBookObj = { ownerId: newBookData.userId, bookName: bookName, activeFlag:1 }
                                    db.collection(clnBooks).insertOne(newBookObj, function(err, data){
                                        if(err) {
                                            handleError(err, err.message, "DB-Error adding new book clnBooks");
                                        } else {
                                            res.send({ msg:"New Book Added Succesfully", status:200 });
                                        }
                                    });
                                } else {
                                    res.send({ msg:"This book name is already taken", status:409 });
                                }
                            }
                        });
                    }
                }
            });
        }
    }); //End CREATE Book POST


    app.post('/fetchallbooks', function(req, res){
        var userId = req.body.userId;
        if(!(req.body.userId)) {
            handleError(res, "Invalid Data", "User ID not received")
        } else {

            var query = { ownerId: userId, activeFlag:1 };

            db.collection(clnBooks).find(query).toArray(function(err, result) {
                if (err) {
                    handleError(res, err.message, "DB-Error Finding users books")
                } else {
                    res.json({ 
                        status: 200,
                        allBooks: result
                    });
                }
            });
        }
    });//End READ Books POST


    app.post('/editbook', function(req,res){
        var bookObjId = objectID(req.body.bookId);
        var userId = req.body.userId;
        var editedName = req.body.editedName;
        
        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.editedName))) {
            return handleError(res, "Invalid Data", "UserID or BookID missing", 400);
        } else {
            
            db.collection(clnBooks).findOne({ ownerId: userId, bookName: editedName, activeFlag:1 }, function(err, dbRes){
                if(err) {
                    handleError(err, err.message, "DB Error Editing Book. Find");
                } else {
                    if(dbRes === null) {
                        bookQueryObj = { _id: bookObjId, ownerId: userId };
                        db.collection(clnBooks).updateOne(bookQueryObj, { $set: { bookName: editedName } }, function(err, editedBook){
                            if(err) {
                                handleError(err, err.message, "DB Error setting new edit book data");
                            } else {
                                res.json({msg:"Success", status:200});
                            }
                        });
                    } else {
                        res.json({ msg:'Book with same name already exists', status:409 });
                    }
                }
            });
        }
    });//End UPDATE Book Post

    app.post('/deletebook', function(req,res){
        var userId = req.body.userId;
        var bookObjId = objectID(req.body.bookId);

        if((!(req.body.userId)) || (!(req.body.bookId))) {
            return handleError(res, "Invalid Data", "UserID or BookID missing", 400);
        } else {
            accountsInBookQueryObj = { ownerId: userId, bookId: req.body.bookId }
            bookQueryObj = { ownerId: userId, _id: bookObjId };

            db.collection(clnBooks).updateOne(bookQueryObj, { $set: { activeFlag:0 } } , function(err, data){
                if(err) {
                    cosnole.log(err)
                } else {
                    res.json({ message: "success", status: 200 });
                }
            });

        }
    });//End Delele Book POST

} //End Module Exports