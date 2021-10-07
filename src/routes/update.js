const e = require('express');
var express = require('express');
var router = express.Router();
let Doc = require('../models/Doc');

var crud = require('../models/crud');

/**
 * expecting id (optional), name, content 
 */
router.post("/", async (req, res) => {

    // if id specified, update existing
    console.log(req.body, "body");
    if (req.body.id) {
        try {
            req.body.updated = new Date(); // assert current date

            let doc = await Doc.findByIdAndUpdate(req.body.id, req.body, {returnOriginal: false});

            if (!doc) throw Error('No document with specified id found.');

            res.status(201).json(doc);

        }  catch (e) {
            res.status(400).json({ msg: e.message });
        }

        return;
    }

    // below triggers if no id is specified, then new document is created.
    const newDoc = new Doc(req.body);
      try {
        const doc = await newDoc.save();

        if (!doc) throw Error('Something went wrong saving the document');
    
        res.status(200).json(doc);
      } catch (e) {
        res.status(400).json({ msg: e.message });
      }
});

module.exports = router;