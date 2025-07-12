const exress = require('express');
const router = exress.Router();
const {UserController}  = require('../../controllers');

// 
router.post('/', UserController.createUser);


module.exports = router;