const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token: token
        })
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please proved email and password!' });
        }

        const dbUser = await User.findOne({ email }).select('+password');
        if (!dbUser || !(await dbUser.passwordIsMatch(password, dbUser.password))) {
            return res.status(401).json({ status: 'fail', message: 'Invalid email or password.' });
        }

        const token = signToken(dbUser._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message })
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'Invalid Token' });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Invalid Token' });
    }
}