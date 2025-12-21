const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'The email you provided is invalid!']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8,
        select: false //Never select it from the database
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords do not match!'
        }
    }
});

//Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.passwordIsMatch = async function(password, dbPassword) {
    return await bcrypt.compare(password, dbPassword);
}

const User = mongoose.model("User", UserSchema);
module.exports = User;