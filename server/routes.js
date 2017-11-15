module.exports = function(app, db) {

    require('./services/authService')(app, db);
    require('./services/bookService')(app, db);
    require('./services/accountService')(app, db);
    require('./services/transactionService')(app, db);
    require('./services/noteService')(app, db);

};