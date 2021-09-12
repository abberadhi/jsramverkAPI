var express = require('express');
var router = express.Router();

var database = require('../db/database');

router.post("/", (req, res) => {
    console.log(req.body)

    

    res.json(req.body);
});

module.exports = router;