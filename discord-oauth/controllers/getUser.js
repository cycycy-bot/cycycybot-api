const jwt = require('jsonwebtoken');

const getUser = (req, res, fetch) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      const accessToken = decoded.access_token.access_token;
      fetch('https://discordapp.com/api/users/@me',
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(disRes => disRes.json())
        .then((tokenRes) => {
          res.status(200).json(tokenRes);
        });
    });
  }
};

module.exports = {
  getUser,
};
