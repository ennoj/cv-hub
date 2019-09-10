const express = require('express');
const router = express.Router();

// ROUTE: GET api/posts
// KUVAUS: Testi-route
// YKSITYISYYS: JULKINEN
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
