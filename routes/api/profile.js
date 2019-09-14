const express = require('express');
const request = require('request');
const config = require('config');
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
    // Haetaan user-collectionin data
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
      check('status', 'Status vaaditaan')
        .not()
        .isEmpty(),
      check('skills', 'Taidot vaaditaan')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Rakenna profiili-objekti
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Rakenna some-objekti
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // Päivitä tai luo profiili
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE: GET api/profile
// KUVAUS: Hae kaikki profiilit
// YKSITYISYYS: JULKINEN
router.get('/', async (req, res) => {
  try {
    // Haetaan user-collectionin data
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    req.status(500).send('Server Error');
  }
});

// ROUTE: GET api/profile/user/:user_id
// KUVAUS: Hae profiili user_id:n perusteella
// YKSITYISYYS: JULKINEN
router.get('/user/:user_id', async (req, res) => {
  try {
    // Haetaan user-collectionin data
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profiilia ei löytynyt' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profiilia ei löytynyt' });
    }

    req.status(500).send('Server Error');
  }
});

// ROUTE: DELETE api/profile
// KUVAUS: Poista profiili, käyttäjä ja tilapäivitykset
// YKSITYISYYS: YKSITYINEN
router.delete('/', auth, async (req, res) => {
  try {
    // Poista profiili
    await Profile.findOneAndRemove({ user: req.user.id });
    // Poista käyttäjä
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'Käyttäjä poistettu' });
  } catch (err) {
    console.error(err.message);

    req.status(500).send('Server Error');
  }
});

// ROUTE: PUT api/profile/experience
// KUVAUS: Lisää profiiliin kokemus
// YKSITYISYYS: YKSITYINEN
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Titteli vaaditaan')
        .not()
        .isEmpty(),
      check('company', 'Yritys vaaditaan')
        .not()
        .isEmpty(),
      check('from', 'Aloituspäivä vaaditaan')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title: title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE: DELETE api/profile/experience/:exp_id
// KUVAUS: Poista profiiliin kokemus
// YKSITYISYYS: YKSITYINEN
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // Hae käyttäjän profiili
    const profile = await Profile.findOne({ user: req.user.id });

    // Hae poistettavan kokemuksen indexi
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    // Poista kokemus
    profile.experience.splice(removeIndex, 1);

    // Tallenna
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: PUT api/profile/education
// KUVAUS: Lisää profiiliin koulutus
// YKSITYISYYS: YKSITYINEN
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'Koulu vaaditaan')
        .not()
        .isEmpty(),
      check('degree', 'Tutkinto vaaditaan')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Toimiala vaaditaan')
        .not()
        .isEmpty(),
      check('from', 'Aloituspäivä vaaditaan')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school: school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE: DELETE api/profile/education/:edu_id
// KUVAUS: Poista profiiliin koulutus
// YKSITYISYYS: YKSITYINEN
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // Hae käyttäjän profiili
    const profile = await Profile.findOne({ user: req.user.id });

    // Hae poistettavan kokemuksen indexi
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    // Poista kokemus
    profile.education.splice(removeIndex, 1);

    // Tallenna
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: GET api/profile/github/:username
// KUVAUS: Hae Githubin repot
// YKSITYISYYS: JULKINEN
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=10&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'Github-profiilia ei löytynyt' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
