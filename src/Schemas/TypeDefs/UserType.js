
let { GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        created: { type: GraphQLString },
        token: { type: GraphQLString },
        msg: { type: GraphQLString },
    })
});

module.exports = UserType;