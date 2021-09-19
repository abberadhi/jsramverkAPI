let database = require('../db/database');
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    create: async function (data) {
        let db = await database.getDb();

        //if id is specified
        if (data.id) {
            res = await this.update(data);
            return res;
        }

        return new Promise(async (resolve, reject) => {
            let res;

            try {
                let cd = new Date();
                data.name = "Untitled";
                data.created = cd;
                data.updated = cd;

                res = await db.collection.insertOne(data);
                db.client.close();
                resolve(res);
            } catch(e) {
                reject(e);
            }
        });

    },
    findAll: async function() {
        let db = await database.getDb();
        let res;

        return new Promise(async (resolve, reject) => {
            try {
                res = await db.collection.find().sort( { "_id": 1 } ).toArray();
                console.log(res);
                resolve(res);
            } catch(e) {
                reject(e);
            }
            finally {
                db.client.close();
            }
        });
    },
    find: async function(data) {
        let db = await database.getDb();
        let res;

        return new Promise(async (resolve, reject) => {
            try {
                res = await db.collection.findOne({"_id": ObjectId(data.id)});
                resolve(res);
            } catch(e) {
                reject(e);
            }
            finally {
                db.client.close();
            }
        });
    },
    update: async function(data) {
        let db = await database.getDb();

        return new Promise(async (resolve, reject) => {
            let res;
            
            try {
                res = await db.collection.updateOne(
                    {"_id": ObjectId(data.id)}, 
                    {$set: {
                        name: data.name, 
                        content: data.content,
                        updated: new Date()
                    }}
                );
                resolve(res);
            } catch(e) {
                reject(e);
            }
            finally {
                db.client.close();
            }
        });
    },
    delete: async function(data) {
        let db = await database.getDb();
        let res;

        return new Promise(async (resolve, reject) => {
            try {
                res = await db.collection.deleteOne({"_id": ObjectId(data.id)});
                resolve(res);
            } catch(e) {
                reject(e);
            } finally {
                db.client.close();
            }
        })
    }
}