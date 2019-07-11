const { BOT_TOKEN } = process.env;

const getGuild = (req, res, fetch) => {
  const { serverId } = req.params;
  const { token } = req.body;

  console.log(serverId);
  const fetchUserGuilds = fetch('https://discordapp.com/api/users/@me/guilds', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(apiRes => apiRes.json())
    .then((guilds) => {
      const adminGuilds = guilds.filter(g => g.permissions === 2146959359);
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

  Promise.all([fetchUserGuilds, fetchBotGuilds])
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
      const filteredGuild = guilds.filter(guild => guild.id === serverId);
      if (filteredGuild[0].bot) {
        return res.status(200).json(filteredGuild[0]);
      }
      return res.status(500).json({
        error: 'bot not in server',
        bot: false,
      });
    });
};

module.exports = {
  getGuild,
};
