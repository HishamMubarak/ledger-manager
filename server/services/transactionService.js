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
    
    app.post('/addtransaction', function(req,res){
        userId = req.body.userId;
        bookId = req.body.bookId;
        accountObjId = objectID(req.body.accountId);
        formData = req.body.formData;
        formData.date = new Date(formData.date).toDateString(); 
        
        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId)) || (!(req.body.formData))) {
            return handleError(res, "Invalid Data", "User ID and/or Book ID and/or AccountID and/or Form Data is Missing", 400)
        } else {

            findAccountObj = { _id: accountObjId, ownerId: userId, bookId: bookId };
            if(formData.amountRadio == "credit") {
                newTransData = { $push: { transactions: { transId: new objectID, date: formData.date, description: formData.description, 
                            creditAmt: formData.amount, debitAmt: 0, transType: formData.amountRadio } } };
            } else if (formData.amountRadio == "debit") {
               newTransData = { $push: { transactions: { transId: new objectID, date: formData.date, description: formData.description, 
                            creditAmt: 0, debitAmt: formData.amount, transType: formData.amountRadio } } }; 
            } else {
                return handleError(res, "Invalid Transaction Data", "Enter Transaction Data Correctly", 400);
            }

            db.collection(clnAccounts).update(findAccountObj, newTransData , function(err, insertedData){
                if (err) {
                    handleError(err, err.message, "DB-Error adding transaction to database");
                } else {
                    res.json({ msg: "Succesfully Inserted", status: 200 });
                }
            });
            
        }
    });//End CREATE Transaction Post


    app.post('/gettransactions', function(req,res){
        userId = req.body.userId;
        bookId = req.body.bookId;
        accountObjId = objectID(req.body.accountId);

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId))) {
            handleError(res, "Invalid Data", "User ID and/or Book ID and/or AccountID and/or Form Data is Missing", 400)
        } else {

            var bookName;

            db.collection(clnBooks).findOne({ _id: objectID(bookId) }, { bookName:1 } , function(err, bookNameObj){
                if(err) {
                    console.log(err);
                } else {
                    bookName = bookNameObj.bookName;
                }
            });
            

            findAccountObj = { _id: accountObjId, ownerId: userId, bookId: bookId };
            db.collection(clnAccounts).find(findAccountObj, { transactions:1, accountName:1 }).toArray(function(err, allTrans){
                if(err) {
                    handleError(err, err.message, "DB Error reading transactions");
                } else {
                        if(allTrans[0].hasOwnProperty('transactions')) {
                            sortTransactions = allTrans[0].transactions;
                            sortTransactions.sort(function(a,b){
                                var dateA = new Date(a.date), dateB = new Date(b.date);
                                return dateA - dateB;
                            });

                            res.json({ 
                                status: 200,
                                data: sortTransactions,
                                bookName: bookName,
                                accountName: allTrans[0].accountName
                            });

                        } else {
                            res.json({ 
                                status: 204,
                                bookName: bookName,
                                accountName: allTrans[0].accountName
                            });
                        }
                }
            });
        }
    });//End READ Transactions POST

    app.post('/edittransaction', function(req,res){

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId)) || (!(req.body.formData))) {
            return console.log("Invalid Data Error")
        }

        userId = req.body.userId;
        bookId = req.body.bookId;
        accountObjId = objectID(req.body.accountId);
        formData = req.body.formData;

        if(formData.editTransType == "credit") {
            editTransData = { "$set" : { 
                "transactions.$.data" : formData.editDate,
                "transactions.$.description" : formData.editDescription,
                "transactions.$.creditAmt" : formData.amount,
                "transactions.$.debitAmt" : 0,
                "transactions.$.transType" : formData.editTransType
            }}; 
        } else if (formData.editTransType == "debit") {
            editTransData = { "$set" : { 
                "transactions.$.date" : formData.editDate,
                "transactions.$.description" : formData.editDescription,
                "transactions.$.creditAmt" : 0,
                "transactions.$.debitAmt" :  formData.amount,
                "transactions.$.transType" : formData.editTransType
            }}; 
        } else {
            return handleError(res, "Invalid Transaction Data", "Enter Transaction Data Correctly", 400);
        } 

        findAccountObj = { _id: accountObjId, ownerId: userId, bookId: bookId, "transactions.transId": objectID(formData.editTransId) };
        db.collection(clnAccounts).update(findAccountObj, editTransData, function(err, dbRes){
            if(err) {
                console.log(err)
            } else {
                res.json({ status:200, message:"Success" });
            }
        });

    }); //End UPDATE/EDIT Transaction Post

    app.post('/deletetransaction', function(req, res){
        userId = req.body.userId;
        bookId = req.body.bookId;
        accountObjId = objectID(req.body.accountId);
        transId = objectID(req.body.transId)

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId)) || (!(req.body.transId))) {
            console.log("Invalid Data Error")
        } else {
            findAccountObj = { _id: accountObjId, ownerId: userId, bookId: bookId };
            db.collection(clnAccounts).update(findAccountObj, { $pull: { transactions : { transId : transId }}}, function(err, dbRes){
                if(err) {
                    console.log(err)
                } else {
                    console.log(dbRes);
                    res.json({ status:200, message:"Success" });
                }
            })
        }
    });// End DELETE Transaction Post

}