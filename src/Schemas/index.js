//temmp
let Doc = require('../models/Doc');
let graphql, { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const DocType = require('./TypeDefs/DocType');
const UserType = require('./TypeDefs/UserType');

// user resolver
const register = require('./resolvers/userResolvers');

console.log(register)
console.log(register.register)

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
                console.log("entering resolve0")


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
        registerUser: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve: register.register
        },
    }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation })
