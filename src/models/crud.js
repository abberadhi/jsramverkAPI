let database = require('../db/database');
const Objectid = require("mongodb").ObjectId;

let a = {
    create: async function (data) {

        //if id is specified
        if (data.id) {
            this.update(data);
            return;
        }

        try {
            let db = await database.getDb();
            await db.collection.insertOne(data);
        } catch(e) {
            console.log(e);
        } finally {
            db.client.close();
        }
    },
    update: async function(data) {

        try {
            let db = await database.getDb();

            await db.collection.updateOne(
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
    }
}

a.create({name: "non-existent", content: "<h1>amazing content</h1>"})