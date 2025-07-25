const{UserService} = require('../services');
const{StatusCodes} = require('http-status-codes')
const{SuccessResponse, ErrorResponse} = require('../utils/common');



/*
post req :/signup
req-body {email:'a@b.com', password:1234}
*/
async function createUser(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user
        return res.
                   status(StatusCodes.CREATED)
                  .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.
                   status(error.statusCode)
                  .json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user
        return res.
                   status(StatusCodes.CREATED)
                  .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.
                   status(error.statusCode)
                  .json(ErrorResponse);
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user
        return res.
                   status(StatusCodes.CREATED)
                  .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.
                   status(error.statusCode)
                  .json(ErrorResponse);
    }
}

module.exports = {
    createUser,
    signin,
    addRoleToUser
}