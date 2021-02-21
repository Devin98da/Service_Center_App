// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var SuperAdminModelSchema = new Schema({
//     user_id: {
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User',
//         required: [true, 'User field is required!']
//     },
//     created_date: {
//         type: Date,
//         default: Date.now
//     }
// });

// const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminModelSchema);
// module.exports = { SuperAdmin }
var mongoose = require('mongoose'); //Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.
var bcrypt = require('bcrypt'); // Password encryption
require("dotenv").config();
const jwt = require('jsonwebtoken');
const UserRole = require('../enums/UserRole');

const SALT = 10;

var Schema = mongoose.Schema;

var SuperAdminModelSchema = new Schema({
    name: {
        type:String,
        required: [true, 'Name field is required!'],
        maxlength: 100
    },
    email: {
        type:String,
        required: [true, 'E-mail field is required!'],
        unique:true // email eka unique wenw, Can't register twise
    },
    username: {
        type:String,
        required: [true, 'Username field is required!'],
        unique:true // username eka unique wenw, 
    },
    password: {
        type: String,
        minLength: 5,
        required:[true, 'Password field is required!']
    },
    role: {
        type:String,
        enum: UserRole,
        required: [true, 'Role field is required!'],
        default: UserRole.SUPER_ADMIN
    },
    profile_image: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }

});

// Saving user data
SuperAdminModelSchema.pre('save', function (next) {
    var superAdmin = this;
    if (superAdmin.isModified('password')) {
        //checking if password field is available and modified
        bcrypt.genSalt(SALT, function (err, salt) {
            if (err) return next(err)
        
            bcrypt.hash(superAdmin.password, salt, function (err, hash) {
                if (err) return next(err)
                superAdmin.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
// For comparing the users entered password with database duing login 
SuperAdminModelSchema.methods.comparePassword = function (candidatePassword, callBack) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callBack(err);
        callBack(null, isMatch);
    });
};

// For generating token when loggedin
SuperAdminModelSchema.methods.generateToken = function (callBack) {
    var superAdmin = this;
    var token = jwt.sign(superAdmin._id.toHexString(), process.env.SECRETE);
    
    callBack(null, token);
};

// Validating token for auth routes middleware
SuperAdminModelSchema.statics.findByToken = function (token, callBack) {
    jwt.verify(token, process.env.SECRETE, function (err, decode) {
        // This decode must give user_id if token is valid .ie decode = user_id
        SuperAdmin.findById(decode, function(err, superAdmin) {
            if (err) {
                res.json({status: false, data: "Invalid Super Admin ID"});
            }

            callBack(null, superAdmin);
        });
    });
};

const SuperAdmin= mongoose.model('SuperAdmin', SuperAdminModelSchema);
module.exports = { SuperAdmin }
