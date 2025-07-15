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
    console.log(user);
    if(!user){
        throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND)
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password); 
    console.log(passwordMatch)
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
    return user.id;

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

async function addRoletoUser(data){
    try {
        const user = await userRepo.get(data.id);
        if(!user){
        throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND)
    }
        const role = await roleRepo.getRoleByName(data.role)
        if(!role){
        throw new AppError('No role found for the given name',StatusCodes.NOT_FOUND)
    }
    user.addRole(role);
        return user;

    } catch (error) {
    if(error instanceof AppError) throw error;
    console.log(error)
    throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function isAdmin(id) {
     try {
        const user = await userRepo.get(id);
        if(!user){
        throw new AppError('No user found for the given id',StatusCodes.NOT_FOUND)
    }
        const adminrole = await roleRepo.getRoleByName(Enums.USER_ROLES.ADMIN)
        if(!adminrole){
        throw new AppError('No role found for the given name',StatusCodes.NOT_FOUND);  
    }
    return user.hasRole(adminrole);

    } catch (error) {
    if(error instanceof AppError) throw error;
    console.log(error)
    throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}


module.exports ={
    create,
    signin,
    isAuthenticated, 
    addRoletoUser,
    isAdmin
}