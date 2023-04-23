const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req,res) => {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token: user.createToken()})
}

const login = async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password){
        BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    const isMatch = user.comparePassword(password)
    if(!user || !isMatch)
        throw new UnauthenticatedError('Invalid credentials.')
    else{
       res.status(StatusCodes.OK).json({token: user.createToken()});
    }
}

module.exports = { register, login }