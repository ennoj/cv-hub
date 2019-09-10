const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// ROUTE: GET api/auth
// KUVAUS: Testi-route
// YKSITYISYYS: JULKINEN
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: POST api/auth
// KUVAUS: Todenna käyttäjä ja nouda token
// YKSITYISYYS: JULKINEN
router.post(
  '/',
  [
    check('email', 'Sähköposti vaaditaan').isEmail(),
    check('password', 'Salasana vaaditaan').exists()
  ],
  async (req, res) => {
    // TEST: console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Deconstrutoidaan
    const { email, password } = req.body;

    try {
      // ONKO KÄYTTÄJÄ OLEMASSA?
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Ei valtuuksia' }] });
      }

      // TÄSMÄÄKÖ SALASANA?
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Ei valtuuksia' }] });
      }

      // PALAUTA JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
