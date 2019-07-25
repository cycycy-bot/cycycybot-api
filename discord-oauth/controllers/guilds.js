const { BOT_TOKEN } = process.env;

const getGuilds = (req, res, fetch) => {
  const token = res.locals.decoded.access_token.access_token;

  const fetchUserGuilds = fetch('https://discordapp.com/api/users/@me/guilds', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(apiRes => apiRes.json())
    .then((guilds) => {
      const adminGuilds = guilds.filter(g => g.permissions === 2147483647);
      return adminGuilds;
    });

  const fetchBotGuilds = fetch('https://discordapp.com/api/users/@me/guilds', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${BOT_TOKEN}`,
    },
  })
    .then(apiRes => apiRes.json());

  return Promise.all([fetchUserGuilds, fetchBotGuilds])
    .then(([user, bot]) => {
      user.map((userGuilds) => {
        bot.map((botGuilds) => {
          if (userGuilds.id === botGuilds.id) {
            userGuilds.bot = true;
          }
        });
      });
      return user;
    })
    .then((guilds) => {
      res.status(200).json(guilds);
    })
    .catch(() => res.status(404).json({
      error: 'Error',
    }));
};

module.exports = {
  getGuilds,
};
