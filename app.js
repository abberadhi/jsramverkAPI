
const express = require('express');
const morgan = require('morgan');
const port = process.env.PORT || 1337;
var app = express();
const httpServer = require("http").createServer(app);
var cors = require('cors');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./src/config');

//temmp
let Doc = require('./src/models/Doc');
let graphql, { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

// routes
const api = require('./src/routes/api/documents');

app.use(cors());

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.sockets.on('connection', function(socket) {
    socket.on('create', function(room) {
        socket.join(room);
    });

    socket.on('sync', function(data) {
        socket.to(data.id).emit("doc", {content: data.content, name: data.name});
    });
});

// Connect to Mongo
mongoose
  .connect("mongodb://127.0.0.1:27017/docs", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

 // don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(express.json());

// graphql


// schema

const DocType = new GraphQLObjectType({
    name: "Document",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        content: { type: GraphQLString },
        created: { type: GraphQLString },
        updated: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllDocuments: {
            type: new GraphQLList(DocType),
            async resolve(parent, args) {
                return await Doc.find();
            }
        },
        getDocumentById: {
            type: DocType,
            args: { id: { type: GraphQLString }},
            async resolve(parent, args) {
                return await Doc.findById(args.id);
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        editDocument: {
            type: DocType,
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                content: { type: GraphQLString },
                created: { type: GraphQLString },
                updated: { type: GraphQLString }
            },
            async resolve(parent, args) {
                // if id specified, update existing
                if (args.id) {
                    try {
                        args.updated = new Date(); // assert current date
                        let doc = await Doc.findByIdAndUpdate(args.id, args, {returnOriginal: false});
                        if (!doc) throw Error('No document with specified id found.');
                        return {msg: doc}
                    }  catch (e) {
                        return { msg: e.message };
                    }
                }
            
                

                try {
                    // below triggers if no id is specified, then new document is created.
                    const newDoc = new Doc(args);
                    args.updated = new Date(); // assert current date
                    args.created = new Date(); // assert current date

                    const doc = await newDoc.save();
                if (!doc) throw Error('Something went wrong saving the document');
                    return doc;
                } catch (e) {
                    return { msg: e.message };
                }
            }
        },
        deleteDocument: {
            type: DocType,
            args: {
                id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const document = await Doc.findByIdAndDelete(args.id);
                    if (!document) throw Error('No document found');
            
                    return document;
                  } catch (e) {
                    return { msg: e.message, success: false };
                  }
            }
        },
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// index route
app.use('/api', api);

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;