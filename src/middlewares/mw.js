var express = require('express');
const cors = require('cors');
const morgan = require('morgan');

module.exports = (app) => {

    app.use(cors());

    // don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
        // use morgan to log at command line
        app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
    }

    app.use(express.json());

    app.use((req, res, next) => {
        console.log(req.method);
        console.log(req.path);
        next();
    });

    return app;

}
