const graphql = require('graphql');
const mongoose = require('mongoose');
const Cmd = require('../../models/customCommandsDB');

const {
  GraphQLString,
  GraphQLNonNull,
} = graphql;

const { CustomCommandsType } = require('../types/customCommandsType');

const addCmd = {
  type: CustomCommandsType,
  args: {
    id: { type: GraphQLString },
    serverID: { type: new GraphQLNonNull(GraphQLString) },
    serverName: { type: new GraphQLNonNull(GraphQLString) },
    commandName: { type: new GraphQLNonNull(GraphQLString) },
    commandRes: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    const cmd = new Cmd({
      _id: mongoose.Types.ObjectId(),
      serverID: args.serverID,
      serverName: args.serverName,
      commandName: args.commandName,
      commandRes: args.commandRes,
    });

    const defaultCmds = ['avatar', 'stats', 'uptime', 'restart', 'addcmd', 'delcmd', 'editcmd', 'userinfo', 'advice', 'tempmute', 'translate', 'wiki', 'afk', 'notify', 'unmute', 'help', 'tuck', 'warn', 'serverinfo', 'botinfo', 'catfact', 'test', ''];

    return Cmd.find({ serverID: args.serverID, commandName: args.commandName }).then((cmdRes) => {
      if (cmdRes.length >= 1) throw new Error('Command already exists');
      if (defaultCmds.includes(args.commandName)) throw new Error('Can\'t add default commands');
      return cmd.save();
    });
  },
};

const delCmd = {
  type: CustomCommandsType,
  args: {
    serverID: { type: new GraphQLNonNull(GraphQLString) },
    commandName: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    return Cmd.findOneAndDelete({ serverID: args.serverID, commandName: args.commandName });
  },
};

const editCmd = {
  type: CustomCommandsType,
  args: {
    serverID: { type: new GraphQLNonNull(GraphQLString) },
    commandName: { type: new GraphQLNonNull(GraphQLString) },
    commandRes: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    return Cmd.findOneAndUpdate(
      { serverID: args.serverID, commandName: args.commandName },
      { commandRes: args.commandRes },
      { useFindAndModify: false },
    );
  },
};

module.exports = {
  addCmd,
  delCmd,
  editCmd,
};
