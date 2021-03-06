const { UnauthorizedError } = require('../errors') 
// index.js is default for export from folder, thats why we omit it in require
const jwt = require('jsonwebtoken') // package to work with JWT


const authenticationMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization; 
    // request for protected route must be made with authorization: "Bearer <jwt token>" 
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthorizedError('No token provided')
    }
    const token = authHeader.split(' ')[1]; // getting token from authHeader "Bearer <jwt token>"
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded) -> { id: 12, username: 'john', iat: 1655031342, exp: 1657623342 } 
        // -> goes from jwt.sign(...) at controllers/main
        const {id, username} = decoded;
        req.user = {id, username}; 
        next()
        // !!! here we created property USER on request object and passed to the next middleware,
        // WHERE IT WILL BE ACCESSIBLE !!!

    }catch(e){
        throw new UnauthorizedError('Not authorized to enter the route')
    }

}

module.exports = authenticationMiddleware