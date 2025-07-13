const exress = require('express');
const router = exress.Router();
const {UserController}  = require('../../controllers');

// 
router.post('/signup', UserController.createUser);
router.post('/signin', UserController.signin);


module.exports = router;