const graphql = require('graphql');
const mongoose = require('mongoose');
const Mod = require('../../models/modDBtest');

const {
  GraphQLString,
  GraphQLNonNull,
} = graphql;

// mod type
const { ModType } = require('../types/modtype');

const addMod = {
  type: ModType,
  args: {
    id: { type: GraphQLString },
    serverID: { type: new GraphQLNonNull(GraphQLString) },
    serverName: { type: new GraphQLNonNull(GraphQLString) },
    modName: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    const mod = new Mod({
      _id: mongoose.Types.ObjectId(),
      serverID: args.serverID,
      serverName: args.serverName,
      modName: args.modName,
    });

    Mod.findOneAndUpdate(
      { serverID: args.serverID },
      { serverName: args.serverName, modName: args.modName },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      },
    ).then(res => res);
  },
};

const delMod = {
  type: ModType,
  args: {
    id: { type: GraphQLString },
    serverID: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    return Mod.findOneAndDelete({ serverID: args.serverID });
  },
};

module.exports = {
  addMod,
  delMod,
};
