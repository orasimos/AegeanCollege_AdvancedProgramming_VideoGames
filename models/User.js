const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        //Regex για την επαλήθευση της μορφής του email
        match: [/\S+@\S+\.\S+/, 'The email you provided is invalid!']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        //Ορισμός ελάχιστου μήκους κωδικού
        minlength: 8,
        //Αγνοείται κατά την ανάκτηση του User από τη βάση
        select: false
    },
    //Χρήση κατά το registration
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            //Για τη σύγκριση με το password κατά την εγγραφή
            validator: function(el) {
                return el === this.password
            },
            message: 'Passwords do not match!'
        }
    },
});

//Hash του password πριν την αποθήκευση
UserSchema.pre('save', async function() {
    //Αν ο κωδικός δεν έχει ενημερωθεί δεν κρυπτογράφηση
    if (!this.isModified('password')) return;
    //Κρυπτογράφηση του κωδικού
    this.password = await bcrypt.hash(this.password, 12);
    //Εκχωρώντας την τιμή undefined αγνοείται από το schema κατά την αποθήκευση
    this.confirmPassword = undefined;
});

//Σύγκριση με κρυπτογραφημένο κωδικό
UserSchema.methods.passwordIsMatch = async function(password, dbPassword) {
    return await bcrypt.compare(password, dbPassword);
}

const User = mongoose.model("User", UserSchema);
module.exports = User;

