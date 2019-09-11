const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

///// TUO MALLIT /////
const User = require('../../models/User');

// ROUTE: POST api/users
// KUVAUS: Rekisteröi käyttäjä
// YKSITYISYYS: JULKINEN
router.post(
  '/',
  [
    check('name', 'Nimi vaaditaan')
      .not()
      .isEmpty(),
    check('email', 'Sähköposti vaaditaan').isEmail(),
    check(
      'password',
      'Salasanan on oltava vähintään KUUSI merkkiä pitkä'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // TEST: console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Deconstrutoidaan
    const { name, email, password } = req.body;

    try {
      // ONKO KÄYTTÄJÄ JO OLEMASSA?
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Käyttäjä on jo olemassa' }] });
      }

      // HAE GRAVATAR
      const avatar = gravatar.url(email, {
        s: '300',
        // Jos haluat sensuroida: r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // CRYPTAA SALASANA
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
