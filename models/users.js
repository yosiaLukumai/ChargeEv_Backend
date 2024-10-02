const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
let SALT_WORK_FACTOR = 10
const users = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required : true
    },
    balance: {
        type: Number,
    },
    remainedUnit: {
        type: Number,
    },
    fullName: {
        type: String
    },
    Phone: {
        type: String
    },
    userType: {
        type: String,
        enum: ['ADMIN', 'USER', 'DRIVER'],
        required: true
    }
}, {
    timestamps: true
})


users.pre('save', function(next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
users.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
module.exports = mongoose.model("users", users)
