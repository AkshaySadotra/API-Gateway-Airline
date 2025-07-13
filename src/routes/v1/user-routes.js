const exress = require('express');
const router = exress.Router();
const {UserController}  = require('../../controllers');
const{AuthMiddlewares} = require('../../middlewares')

// 
router.post('/signup',AuthMiddlewares.validateAuthRequest,
     UserController.createUser);
router.post('/signin', AuthMiddlewares.validateAuthRequest,
    UserController.signin);


module.exports = router;