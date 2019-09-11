const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// ROUTE: GET api/profile/me
// KUVAUS: Hae käyttäjän profiili
// YKSITYISYYS: YKSITYINEN
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'Käyttäjällä ei ole profiilia' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: POST api/profile
// KUVAUS: Luo tai päivitä käyttäjän profiilia
// YKSITYISYYS: YKSITYINEN
router.post(
  '/',
  [
    auth,
    [
      check('username', 'Käyttäjänimi vaaditaan')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Henkilökohtaiset linkit ei ole tässä
    const {
      username,
      relationship,
      gender,
      location,
      bio,
      facebook,
      twitter,
      instagram,
      im
    } = req.body;

    // Rakenna profiili-objekti
    const profileFields = {};
    profileFields.user = req.user.id;

    if (username) profileFields.username = username;
    if (relationship) profileFields.relationship = relationship;
    if (gender) profileFields.gender = gender;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;

    /* Jos on useampi samassa kentässä:
    if (other) {
      profileFields.other = other.split(',').map(account => account.trim());
    }
    console.log(profileFields.other);
    */

    // Rakenna some-objekti
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (im) profileFields.social.im = im;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Päivitä profiili
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Luo profiili ja lisää syötetty tieto siihen
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
