const mongo = require("mongodb").MongoClient;
const collectionName = "documents";

require('dotenv').config()

const database = {
    getDb: async function getDb() {
        let dsn = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhks9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb+srv://abbe:hIukECQkbh9nTTFE@cluster0.vhks9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,       
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;