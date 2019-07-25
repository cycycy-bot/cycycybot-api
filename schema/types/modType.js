const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql;

const ModType = new GraphQLObjectType({
  name: 'Mod',
  fields: () => ({
    id: { type: GraphQLString },
    serverID: { type: GraphQLString },
    serverName: { type: GraphQLString },
    modName: { type: GraphQLString },
  }),
});

module.exports = {
  ModType,
};
