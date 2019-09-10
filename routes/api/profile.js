const express = require('express');
const router = express.Router();

// ROUTE: GET api/profile
// KUVAUS: Testi-route
// YKSITYISYYS: JULKINEN
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
