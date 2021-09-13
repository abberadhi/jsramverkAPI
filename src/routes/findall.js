const e = require('express');
var express = require('express');
var router = express.Router();

var crud = require('../models/crud');

/**
 * expecting id
 */
router.post("/", async (req, res) => {
    console.log(req.body)

    try {
        crud.findAll().then((output) => res.status(200).json({output}));
    } catch (e) {
        res.status(404).json({msg: "could not find what u were looking for", error: e})
    }
});

module.exports = router;