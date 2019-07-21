const graphql = require('graphql');
const BanPhrase = require('../../models/banPhraseDB');

const {
  GraphQLString,
  GraphQLList,
} = graphql;

// banphrase type
const { BanPhraseType } = require('../types/banphrasetype');

const banphrases = {
  type: new GraphQLList(BanPhraseType),
  args: { serverID: { type: GraphQLString } },
  resolve(parent, args) {
    return BanPhrase.find({ serverID: args.serverID }).then(res => res);
  },
};

module.exports = {
  banphrases,
};
