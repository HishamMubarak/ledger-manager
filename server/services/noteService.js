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


    app.post('/addnote', function(req, res){
        userId = req.body.userId;
        bookId = req.body.bookId;
        accountObjId = objectID(req.body.accountId);
        noteFormData = req.body.formData;

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId)) || (!(req.body.formData))) {
            handleError(res, "Invalid Data", "User ID and/or Book ID and/or AccountID and/or Form Data is Missing", 400)
        } else {
            findAccountObj = { _id: accountObjId, ownerId: userId, bookId: bookId };
            newNoteData = { $push: { notes: { noteId: new objectID, addedDate: new Date(), noteText: noteFormData.noteTextArea, activeFlag:1  } } };
            db.collection(clnAccounts).update(findAccountObj, newNoteData , function(err, insertedNote){
                if (err) {
                    handleError(err, err.message, "DB-Error adding note to database");
                } else {
                    res.json({ msg: "Succesfully Inserted Note", status: 200 });
                }
            });
        }
    });//End CREATE Note POST

    app.post('/fetchallnotes', function(req, res){
        activeFlag = req.body.activeFlag === 0? 0 : 1;

        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId))) {
            handleError(res, "Invalid Data", "User ID and/or Book ID and/or AccountID", 400)
        } else {

            noteAccountQueryObj = {$match: { _id: objectID(req.body.accountId), ownerId: req.body.userId, bookId: req.body.bookId }},
            notesFilterObj = { $project: {
                notes: {$filter: {
                    input: '$notes',
                    as: 'note',
                    cond: {$eq: ['$$note.activeFlag', this.activeFlag]}
                }},
            }};
           
            db.collection(clnAccounts).aggregate(noteAccountQueryObj, notesFilterObj , function(err, allNotes){
                if(err) {
                    console.log(err);
                    handleError(err, err.message, "DB Error Finding Transactions");
                } else {
                    if(allNotes[0].notes !== null) {
                        if(allNotes[0].notes.length !== 0) {
                            res.json({ status: 200, data: allNotes[0].notes });
                        } else {
                            res.json({ status: 204 });
                        }
                    }
                }
            });
        }
    }); //End READ Notes POST

    app.post('/editnote', function(req, res){
        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId)) || (!(req.body.formData))) {
            return handleError(res, "Invalid Data", "User ID and/or Book ID and/or AccountID", 400);
        }
        
        userId = req.body.userId;
        bookId = req.body.bookId;
        accountObjId = objectID(req.body.accountId);
        formData = req.body.formData;

        editNoteData = { '$set' : {
            "notes.$.noteText" : formData.editNoteTextArea,
            "notes.$.editedDate" : new Date()
        }};

        findAccountObj = { _id: accountObjId, ownerId: userId, bookId: bookId, "notes.noteId": objectID(formData.noteId) };
        db.collection(clnAccounts).update(findAccountObj, editNoteData, function(err, dbRes){
            if(err) {
                console.log(err)
            } else {
                res.json({ status:200, message:"Success" });
            }
        });   
    });


    app.post('/deletenote', function(req,res){
        if((!(req.body.userId)) || (!(req.body.bookId)) || (!(req.body.accountId)) || (!(req.body.noteId))) {
            handleError(res, "Invalid Data", "User ID and/or Book ID and/or AccountID", 400)
        } else {
            findNote = { _id: objectID(req.body.accountId), ownerId: req.body.userId, bookId: req.body.bookId, "notes.noteId": objectID(req.body.noteId) };
            db.collection(clnAccounts).update(
                findNote, 
                { $set: { "notes.$.activeFlag": 0 }}, 
                function(err, allNotes){
                    if(err) {
                        console.log(err);
                    } else {
                        res.json({ status: 200, msg: "Success" });
                    }
            });
        }
    }); //End DELETE Note POST


}