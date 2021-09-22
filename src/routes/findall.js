const e = require('express');
var express = require('express');
var router = express.Router();

var crud = require('../models/crud');

/**
 * expecting id
 */
router.get("/", async (req, res) => {
    try {
        let output = await crud.findAll();
        res.status(200).json(output)
    } catch (e) {
        res.status(404).json({msg: "could not find what u were looking for", error: e})
    }
});

module.exports = router;