const {UserRepository,RoleRepository}  = require('../repositories')
const{StatusCodes} = require('http-status-codes')
const userRepo = new UserRepository();
const roleRepo = new RoleRepository();
const AppError = require('../utils/error/app-error')
const{Auth, Enums} = require('../utils/common')
async function create(data){
     try {
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(Enums.USER_ROLES.CUSTOMER);
        user.addRole(role); // sequelize provide us these functions
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

async function signin(data){
try {
    const user = await userRepo.getUserByEmail(data.email);
    if(!user){
        throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND)
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password); 
    if(!passwordMatch){
        throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
    }

    const jwt = Auth.createToken({id:user.id, email:user.email});
    return jwt;
} catch (error) {
    if(error instanceof AppError) throw error;
    console.log(error)
    throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
}
}
async function isAuthenticated(token){
try {
    if(!token){
        throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST)
    }
    const response =  Auth.verifyToken(token); // obj
    const user  = await userRepo.get(response.id);
    if(!user){
        throw new AppError('User not found', StatusCodes.NOT_FOUND)
    }
    
} catch (error) {
    if(error instanceof AppError) throw error;
    if(error.name == 'JsonWebTokenError') {
        throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST)
    }
    if(error.name == 'TokenExpiredError') {
        throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST)
    }
    throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
}
}


module.exports ={
    create,
    signin,
    isAuthenticated
}