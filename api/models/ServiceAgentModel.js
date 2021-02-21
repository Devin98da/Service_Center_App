var mongoose = require('mongoose'); //Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.
var bcrypt = require('bcrypt'); // Password encryption
require("dotenv").config();
const jwt = require('jsonwebtoken');
const UserRole = require('../enums/UserRole');

const SALT = 10;

var Schema = mongoose.Schema;

var ServiceAgentModelSchema = new Schema({
    agent_name: {
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
        default: UserRole.ServiceAgent
    },
    profile_image: {
        type: String,
        required: false
    },
    phone_number: {
        type: String,
        required: true
    },
    location: {
        type:String,
        required: [true,"Location is required!"]
    },
    created_date: {
        type: Date,
        default: Date.now
    }

});

// Saving user data
ServiceAgentModelSchema.pre('save', function (next) {
    var serviceAgent = this;
    if (serviceAgent.isModified('password')) {
        //checking if password field is available and modified
        bcrypt.genSalt(SALT, function (err, salt) {
            if (err) return next(err)
        
            bcrypt.hash(serviceAgent.password, salt, function (err, hash) {
                if (err) return next(err)
                serviceAgent.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
// For comparing the users entered password with database duing login 
ServiceAgentModelSchema.methods.comparePassword = function (candidatePassword, callBack) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callBack(err);
        callBack(null, isMatch);
    });
};

// For generating token when loggedin
ServiceAgentModelSchema.methods.generateToken = function (callBack) {
    var serviceAgent = this;
    var token = jwt.sign(serviceAgent._id.toHexString(), process.env.SECRETE);
    
    callBack(null, token);
};

// Validating token for auth routes middleware
ServiceAgentModelSchema.statics.findByToken = function (token, callBack) {
    jwt.verify(token, process.env.SECRETE, function (err, decode) {
        // This decode must give user_id if token is valid .ie decode = user_id
        ServiceAgent.findById(decode, function(err, user) {
            if (err) {
                res.json({status: false, data: "Invalid User ID"});
            }

            callBack(null, user);
        });
    });
};

const ServiceAgent = mongoose.model('ServiceAgent', ServiceAgentModelSchema);
module.exports = { ServiceAgent }

