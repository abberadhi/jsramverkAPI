let graphql, { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const DocType = require('../TypeDefs/DocType');


module.exports = [
    getAllDocuments = {
        type: new GraphQLList(DocType),
        async resolve(parent, args) {
            return await Doc.find();
        }
    },
    getDocumentById = {
        type: DocType,
        args: { id: { type: GraphQLString }},
        async resolve(parent, args) {
            return await Doc.findById(args.id);
        }
    }
]