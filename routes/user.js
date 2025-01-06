const express = require('express');
const router = express.Router();
const {handleUserSignup,handleUserLogin} = require('../constrollers/user');

router.post('/',handleUserSignup)
router.post('/login',handleUserLogin)

module.exports = router;