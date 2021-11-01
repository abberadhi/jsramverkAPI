const e = require('express');
var express = require('express');
var router = express.Router();
let Doc = require('../../models/Doc');

/**
 * get one by id or all
 */
router.get("/", async (req, res) => {
    // if id is specified, signle get doc by id
    if (req.params.id) { 
        try {
            const document = await Doc.findById(req.params.id);
            if (!document) throw Error('No document found');

            res.status(200).json({ data: document, success: true });
        } catch (e) {
            res.status(400).json({ msg: e.message, success: false });
        }
        return;
    }

    try {
        const documents = await Doc.find();
        if (!documents) throw Error('No Documents');
    
        res.status(200).json(documents);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


/**
 * update if id is specified or else create new
 */
router.post("/", async (req, res) => {
    // if id specified, update existing

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

/**
 * delete document by id
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