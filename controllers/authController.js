const env = process.env;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
    return jwt.sign({ userId }, env.JWT_KEY, { expiresIn: env.JWT_DURATION });
};

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });

        const token = createToken(newUser._id);

        res.status(201).json({
            status: "success",
            token,
            data: {
                user: {
                    name: newUser.name,
                    email: newUser.email,
                },
            },
        });
    } catch (err) {
        const isDuplicateKeyError = err.errorResponse?.code === 11000;
        res.status(400).json({
            status: "fail",
            message: isDuplicateKeyError ? "Email already in use" : err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "fail", message: "Please proved email and password!" });
        }

        const dbUser = await User.findOne({ email }).select("+password");
        if (!dbUser || !(await dbUser.passwordIsMatch(password, dbUser.password))) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password." });
        }

        const token = createToken(dbUser._id);

        res.status(200).json({
            status: "success",
            token,
            user: {
                name: dbUser.name,
                email: dbUser.email,
            },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.authorize = async (req, res, next) => {
    try {
        let token = "";
        
        console.log(req.headers.authorization && req.headers.authorization.startsWith("Bearer"));
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
            if (!token) throw Error();
        }

        const decodedToken = jwt.verify(token, env.JWT_KEY);
        const authorizedUser = await User.findById(decodedToken.userId);
        if (!authorizedUser) return res.status(401).json({ status: "fail", message: "Invalid Token" });

        req.user = authorizedUser;
        next();
    } catch (err) {
        res.status(401).json({ status: "fail", message: "Invalid Token" });
    }
};
