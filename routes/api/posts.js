const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// ROUTE: POST api/posts
// KUVAUS: Luo tilapäivitys
// YKSITYISYYS: YKSITYINEN
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Teksti vaaditaan')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Noudetaan käyttäjä User-modelin avulla
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE: GET api/posts
// KUVAUS: Hae kaikki tilapäivitykset
// YKSITYISYYS: YKSITYINEN
router.get('/', auth, async (req, res) => {
  try {
    // Noudetaan tilapäivitykset uusimmasta alkaen
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: GET api/posts/:id
// KUVAUS: Hae tilapäivitys ID:n perusteella
// YKSITYISYYS: YKSITYINEN
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Tilapäivitystä ei löytynyt' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tilapäivitystä ei löytynyt' });
    }

    res.status(500).send('Server Error');
  }
});

// ROUTE: DELETE api/posts/:id
// KUVAUS: Poista tilapäivitys ID:n perusteella
// YKSITYISYYS: YKSITYINEN
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Tarkista löytyykö tilapäivitys ja käyttäjä
    if (!post) {
      return res.status(404).json({ msg: 'Tilapäivitystä ei löytynyt' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Käyttäjällä ei valtuuksia' });
    }

    await post.remove();

    res.json({ msg: 'Tilapäivitys poistettu' });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tilapäivitystä ei löytynyt' });
    }

    res.status(500).send('Server Error');
  }
});

////////////////////////////////
////////// TYKKÄYKSET //////////
////////////////////////////////

// ROUTE: PUT api/posts/like/:id
// KUVAUS: Tykkää tilapäivityksestä
// YKSITYISYYS: YKSITYINEN
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Tarkista onko käyttäjä jo tykännyt tilapäivityksestä
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Tilapäivityksestä on jo tykätty' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: PUT api/posts/unlike/:id
// KUVAUS: Älä tykkää tilapäivityksestä
// YKSITYISYYS: YKSITYINEN
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Tarkista onko käyttäjä jo tykännyt tilapäivityksestä
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res
        .status(400)
        .json({ msg: 'Tilapäivityksestä ei ole vielä tykätty' });
    }

    // Hae poiston indexi
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ROUTE: POST api/posts/comment/:id
// KUVAUS: Kommentoi tilapäivitystä
// YKSITYISYYS: YKSITYINEN
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Teksti vaaditaan')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Noudetaan käyttäjä ja tilapäivitys User- ja Post-modelien avulla
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE: DELETE api/posts/comment/:id/:comment_id
// KUVAUS: Poista kommentti
// YKSITYISYYS: YKSITYINEN
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Nouda kommentti
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Varmista että kommentti on olemassa ja kyseinen käyttäjä loi sen
    if (!comment) {
      return res.status(404).json({ msg: 'Kommenttia ei ole olemassa' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Käyttäjällä ei ole valtuuksia' });
    }

    // Löydä kommentin indexi
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
