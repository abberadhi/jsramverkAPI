const e = require('express');
let express = require('express');
let router = express.Router();
let Doc = require('../models/Doc');

let crud = require('../models/crud');

/**
 * expecting id
 */
router.get("/", async (req, res) => {
    try {
        const document = await Doc.findById(req.params.id);
        if (!document) throw Error('No document found');

        res.status(200).json({ data: document, success: true });
      } catch (e) {
        res.status(400).json({ msg: e.message, success: false });
      }
});

module.exports = router;