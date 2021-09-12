const express = require('express');
const index = require('./routes/index');
const update = require('./routes/update');
const find = require('./routes/find');
const findAll = require('./routes/findall');
const rm = require('./routes/delete');
const port = 1337;

const app = require('./middlewares/mw.js')(express());

// index route
app.use('/', index);
app.use('/update', update);
app.use('/delete', rm);
app.use('/findall', findAll);
app.use('/find', find);
// app.use('/update', update);
// app.use('/update', update);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
