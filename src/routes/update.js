const e = require('express');
var express = require('express');
var router = express.Router();

var crud = require('../models/crud');

/**
 * expecting id (optional), name, content 
 */
router.post("/", async (req, res) => {
    console.log(req.body)

    try {
        let output = await crud.create(req.body);
        res.json({output});
    } catch (e) {
        res.status(404).json({msg: "could not find what u were looking for", error: e})
    }


});

module.exports = router;