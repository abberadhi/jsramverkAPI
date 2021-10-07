const e = require('express');
var express = require('express');
var router = express.Router();
let Doc = require('../models/Doc');

var crud = require('../models/crud');

/**
 * expecting id (optional), name, content 
 */
router.delete("/", async (req, res) => {
    try {
        const document = await Doc.findByIdAndDelete(req.body.id);
        if (!document) throw Error('No document found');

        res.status(200).json({ data: document, success: true });
      } catch (e) {
        res.status(400).json({ msg: e.message, success: false });
      }
});

module.exports = router;