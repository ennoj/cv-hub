const jwt = require('jsonwebtoken');
const config = require('config');

// Middlwareen tulee aina next
module.exports = function(req, res, next) {
  // HAE TOKEN HEADERISTÄ
  const token = req.header('x-auth-token');

  // TARKISTA ONKO TOKENIA
  if (!token) {
    return res.status(401).json({ msg: 'Ei tokenia - Pääsy evätty' });
  }

  // VARMENNA TOKEN
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Aseta decodedin käyttäjä käyttäjäksi
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Tokeni ei ole validi' });
  }
};
