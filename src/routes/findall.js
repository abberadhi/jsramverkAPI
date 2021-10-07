const e = require('express');
var express = require('express');
var router = express.Router();
let Doc = require('../models/Doc');

var crud = require('../models/crud');

/**
 * expecting id
 */
router.get("/", async (req, res) => {
    try {
        const documents = await Doc.find();
        if (!documents) throw Error('No Documents');
    
        res.status(200).json(documents);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

module.exports = router;