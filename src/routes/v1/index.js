const express = require('express');

const { InfoController } = require('../../controllers');
const{AuthMiddlewares} = require('../../middlewares')
const userRouter = require('./user-routes')
const router = express.Router();

router.get('/info', AuthMiddlewares.checkAuth,
    InfoController.info);
router.use('/user', userRouter)

module.exports = router;