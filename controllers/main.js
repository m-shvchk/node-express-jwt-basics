// 1. Check username, password in req.body of post request (login)
// 2. If username and password exist create a new JWT. If not - send error response  
// 3. Send JWT to the frontend. Frontend needs to access it in order to send another request (GET)
// 4. Set up autentication. Only GET request with JWT can access the dashboard

const CustomApiError = require('../errors/custom-error')
const jwt = require('jsonwebtoken') // package to work with JWT

const login = async (req, res) => {
    const {username, password} = req.body
    // check if username and password are valid:
    // - mongoose checks if values are not empty (in this dummy project no DB)
    // - using external package for validation - Joi (in later projects)
    // - checking manually here +

    if(!username || !password){
        throw new CustomApiError('Please provide email and password', 400)
    }

    const id = new Date().getDate() // FOR DEMO PURPOSES. Normally provided by DB
    
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'})
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])

    res.status(200).json({msg: 'user created', token})
}

const dashboard = async (req, res) => {
    const authHeader = req.headers.authorization; 
    // request for protected route must be made with authorization: "Bearer <jwt token>" 

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new CustomApiError('No token provided', 401) // 401 - auth errror
    }

    const token = authHeader.split(' ')[1]; // getting token from authHeader "Bearer <jwt token>"

    // verify the token (jsonwebtoken package method):
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded) -> { id: 12, username: 'john', iat: 1655031342, exp: 1657623342 } 
        // -> goes from jwt.sign(...)

        const luckyNumber = Math.floor(Math.random() * 100)
        res.status(200).json({msg: `Hello, ${decoded.username}`, secret: `Here is your authorized data. Your lucky number is ${luckyNumber}`})
    }catch(e){
        throw new CustomApiError('Not authorized to enter the route', 401)
    }

}

module.exports = {
    login,
    dashboard
}