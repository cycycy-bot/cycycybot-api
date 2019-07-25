const { BOT_TOKEN } = process.env;

const getGuildLength = (req, res, fetch) => {
  fetch('https://discordapp.com/api/users/@me/guilds', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${BOT_TOKEN}`,
    },
  })
    .then(apiRes => apiRes.json())
    .then((guilds) => {
      res.status(200).json(
        guilds.length,
      );
    });
};

module.exports = {
  getGuildLength,
};
