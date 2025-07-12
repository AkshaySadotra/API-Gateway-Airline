const {UserRepository}  = require('../repositories')
const{StatusCodes} = require('http-status-codes')
const userRepo = new UserRepository();
const AppError = require('../utils/error/app-error')
async function create(data){
     try {
        const user = await userRepo.create(data);
        return user;
    } catch (error) {
        
         if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
        throw new AppError(explanation,StatusCodes.BAD_REQUEST);
    }
    throw new AppError('cannot create a new user Object',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports ={
    create
}