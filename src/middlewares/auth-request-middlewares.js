const {StatusCodes} = require('http-status-codes')
const{ErrorResponse} = require('../utils/common');
const AppError = require('../utils/error/app-error');
const{UserService} = require('../services')
function validateAuthRequest(req, res, next){
    if(!req.body.email) {
        ErrorResponse.message = "something went wrong while authenticating user"; 
        ErrorResponse.error= new AppError(['Email not found in the incoming request'],StatusCodes.BAD_REQUEST)
        return res
                   .status(StatusCodes.BAD_REQUEST)
                   .json(ErrorResponse);   
    }
    if(!req.body.password) {
        ErrorResponse.message = "something went wrong while authenticating user"; 
        ErrorResponse.error= new AppError(['Password not found in the incoming request'],StatusCodes.BAD_REQUEST)
        return res
                   .status(StatusCodes.BAD_REQUEST)
                   .json(ErrorResponse);   
    }
    next();
                      
}

async function checkAuth(req, res, next) {
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if(response){ // we are getting a user id
            req.user = response;
            next();
        }
    } catch (error) {
        return res
                   .status(error.statusCode)
                   .json(error);  
    }
}

// calling the next middleware if it is in correct format
// and who will be the next middleware, airplane controller will be the next middleware
module.exports = {
    validateAuthRequest,
    checkAuth
}