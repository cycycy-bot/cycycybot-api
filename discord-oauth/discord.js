const express = require('express');

const router = express.Router();

const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const redirect = encodeURIComponent('http://localhost:3000/redirect');

const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

// controllers
const login = require('./controllers/login');
const guilds = require('./controllers/guilds');
const guild = require('./controllers/guild');
const role = require('./controllers/roles');
const channel = require('./controllers/channels');

router.get('/login', (req, res) => {
  login.handleLogin(req, res);
});

router.post('/getroles', (req, res) => {
  role.getRoles(req, res, fetch);
});

router.post('/getchannels', (req, res) => {
  channel.getChannels(req, res, fetch);
});

router.post('/getguilds', (req, res) => {
  guilds.getGuilds(req, res, fetch);
});

router.post('/getguilds/:serverId', (req, res) => {
  guild.getGuild(req, res, fetch);
});

router.post('/callback', catchAsync(async (req, res) => {
  if (!req.body.code) throw new Error('NoCodeProvided');
  const { code } = req.body;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  const json = await response.json();
  res.status(200).json(json);
}));

module.exports = router;
