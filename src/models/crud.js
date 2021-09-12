let database = require('../db/database');
const Objectid = require("mongodb").ObjectId;

let a = {
    create: async function (data) {
        let db = await database.getDb();


        //if id is specified
        if (data.id) {
            this.update(data);
            return;
        }
        let res;
        try {
            res = await db.collection.insertOne(data);
        } catch(e) {
            console.log(e);
        } finally {
            db.client.close();
        }
        return res;
    },

    readOne: async function(data) {
        let db = await database.getDb();
        let res;
        try {
            res = await db.collection.findOne({"_id": Objectid(data.id)});
        } catch(e) {
            console.log(e);
        } finally {
            db.client.close();
        }
        return res;
    },

    readMultiple: async function(data) {
        let db = await database.getDb();
        let res;
        try {
            res = await db.collection.find(data);
        } catch(e) {
            console.log(e);
        } finally {
            db.client.close();
        }
        return res;
    },

    update: async function(data) {
        let db = await database.getDb();
        let res;
        

        try {
            res = await db.collection.updateOne(
                {"_id": Objectid(data.id)}, 
                {$set: {
                    name: data.name, 
                    content: data.content
                }}
            );
        } catch(e) {
            console.log(e);
        } finally {
            db.client.close();
        }
        return res;
    },
    delete: async function(data) {
        let db = await database.getDb();

        let res;
        try {
            res = await db.collection.deleteOne({"_id": Objectid(data.id)});
        } catch(e) {
            console.log(e);
        } finally {
            db.client.close();
        }
        return res;
    }
}

a.readOne({"id": "613df7bed2cd8d9d95abdd7c"});