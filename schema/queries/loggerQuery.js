const graphql = require('graphql');
const LoggerDB = require('../../models/loggerDB');

const { GraphQLString, GraphQLNonNull } = graphql;

// modtype
const { LoggerType } = require('../types/loggerType');

const logger = {
  type: LoggerType,
  args: { serverID: { type: new GraphQLNonNull(GraphQLString) } },
  resolve(parent, args) {
    return LoggerDB.findOne({ serverID: args.serverID }).then(res => res);
  },
};

module.exports = {
  logger,
};
