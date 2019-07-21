const graphql = require('graphql');

// queries
const { mod } = require('./queries/modQuery');
const { banphrases } = require('./queries/banPhraseQuery');
const { customcommands } = require('./queries/customCommandQuery');
const { logger } = require('./queries/loggerQuery');

// mutations
const { addMod, delMod } = require('./mutations/addDelMod');
const { addBanPhrase, delBanPhrase } = require('./mutations/addDelBanPhrase');
const { enableLogger, disableLogger } = require('./mutations/setLogger');
const { addCmd, delCmd, editCmd } = require('./mutations/addDelCmd');

const {
  GraphQLObjectType,
  GraphQLSchema,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query for grabbing data',
  fields: {
    mod,
    banphrases,
    customcommands,
    logger,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'MutationType',
  description: 'Root mutation query for mutating data',
  fields: {
    addCmd,
    delCmd,
    editCmd,
    addMod,
    delMod,
    addBanPhrase,
    delBanPhrase,
    enableLogger,
    disableLogger,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
