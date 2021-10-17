
let { GraphQLObjectType, GraphQLString } = require('graphql');

const DocType = new GraphQLObjectType({
    name: "Document",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        content: { type: GraphQLString },
        created: { type: GraphQLString },
        updated: { type: GraphQLString }
    })
});

module.exports = DocType;