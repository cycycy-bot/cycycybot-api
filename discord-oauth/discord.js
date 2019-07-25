const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use('/protected', (req, res, next) => {
  // check header for the token
  const { token } = req.body;
  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.json({ message: 'invalid token' });
      }
      // if everything is good, save to request for use in other routes
      res.locals.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    res.send({
      message: 'No token provided.',
    });
  }
});

const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const redirect = encodeURIComponent('http://localhost:3000/redirect');

const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

// controllers
const login = require('./controllers/login');
const user = require('./controllers/getUser');
const guilds = require('./controllers/guilds');
const guild = require('./controllers/guild');
const role = require('./controllers/roles');
const channel = require('./controllers/channels');
const guildLength = require('./controllers/getGuildLength');

router.get('/login', (req, res) => {
  login.handleLogin(req, res);
});

router.post('/protected/getroles', (req, res) => {
  role.getRoles(req, res, fetch);
});

router.post('/getuser', (req, res) => {
  user.getUser(req, res, fetch);
});

router.post('/protected/getchannels', (req, res) => {
  channel.getChannels(req, res, fetch);
});

router.get('/getguildlength', (req, res) => {
  guildLength.getGuildLength(req, res, fetch);
});

router.post('/protected/getguilds', (req, res) => {
  guilds.getGuilds(req, res, fetch);
});

router.post('/protected/getguilds/:serverId', (req, res) => {
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
  if (json.access_token) {
    const payload = { check: true, access_token: json };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 604800,
    });
    return res.status(200).json(token);
  }
  return res.status(500).json({
    err: 'error',
  });
}));

module.exports = router;
