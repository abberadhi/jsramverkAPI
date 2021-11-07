//temmp
let Doc = require('../models/Doc');
let graphql, { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const DocType = require('./TypeDefs/DocType');
const UserType = require('./TypeDefs/UserType');

// user resolver
const register = require('./resolvers/userResolvers');

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllDocuments: {
            type: new GraphQLList(DocType),
            async resolve(parent, args, req) {

                if (!req.isAuth) throw Error('Unauthenticated request!');

                // console.log(req.userEmail);

                let res = await Doc.find({$or:[{"creator": req.userEmail},{"access": req.userEmail}]});

                // let res = await Doc.find();
                console.log(res);

                return res;

            }
        },
        getDocumentById: {
            type: DocType,
            args: { id: { type: GraphQLString } },
            async resolve(parent, args, req) {
                if (!req.isAuth) throw Error('Unauthenticated request!');

                let res = await Doc.findOne({$or:[{"creator": req.userEmail},{"access": req.userEmail}], "_id": args.id });

                return res;
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
                type: { type: GraphQLString },
                creator: { type: GraphQLString },
                created: { type: GraphQLString },
                updated: { type: GraphQLString }
            },
            async resolve(parent, args, req) {
                if (!req.isAuth) throw Error('Unauthenticated request!');

                // if id specified, update existing
                if (args.id) {
                    try {
                        // check if user is owner or has access to the specified document
                        args.updated = new Date(); // assert current date
                        let doc = await Doc.findByIdAndUpdate(args.id, args, { returnOriginal: false });
                        if (!doc) throw Error('No document with specified id found.');
                        return { msg: doc }
                    } catch (e) {
                        return { msg: e.message };
                    }
                }

                try {
                    // below triggers if no id is specified, then new document is created.
                    args.creator = req.userEmail; // make logged in user the owner
                    args.updated = new Date(); // assert current date
                    args.created = new Date(); // assert current date

                    const newDoc = new Doc(args);

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
            async resolve(parent, args, req) {
                try {
                    if (!req.isAuth) throw Error('Unauthenticated request!');

                    console.log(args);

                    const document = await Doc.findByIdAndDelete(args.id);
                    console.log(document);

                    if (!document) throw Error('No document found');

                    return document;
                } catch (e) {
                    return { msg: e.message, success: false };
                }
            }
        },
        addUser: {
            type: DocType,
            args: {
                id: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            async resolve(parent, args, req) {
                if (!req.isAuth) throw Error('Unauthenticated request!');

                await Doc.updateOne(
                    { "_id": args.id },
                    { $addToSet: { access: [args.email] } }
                )

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
        userLogin: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve: register.login
        },
    }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation })
