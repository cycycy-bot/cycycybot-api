const { BOT_TOKEN } = process.env;

const getRoles = (req, res, fetch) => {
  const { id } = req.body;

  fetch(`https://discordapp.com/api/guilds/${id}/roles`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${BOT_TOKEN}`,
    },
  })
    .then(apiRes => apiRes.json())
    .then((roles) => {
      res.status(200).json(roles);
    })
    .catch((err) => {
      res.status(500).json({
        error: "can't find roles",
      });
    });
};

module.exports = {
  getRoles,
};
