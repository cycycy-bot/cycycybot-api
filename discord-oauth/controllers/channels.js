const { BOT_TOKEN } = process.env;

const getChannels = (req, res, fetch) => {
  const { id } = req.body;

  fetch(`https://discordapp.com/api/guilds/${id}/channels`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${BOT_TOKEN}`,
    },
  })
    .then(apiRes => apiRes.json())
    .then((channels) => {
      const textChannels = channels.filter(channel => channel.type === 0);
      res.status(200).json(textChannels);
    })
    .catch((err) => {
      res.status(500).json({
        error: "can't find channels",
      });
    });
};

module.exports = {
  getChannels,
};
