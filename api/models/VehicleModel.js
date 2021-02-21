var mongoose = require('mongoose'); //Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.
var bcrypt = require('bcrypt'); // Password encryption
require("dotenv").config();
const jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var VehicleModelSchema = new Schema({
    vehicle_name: {
        type:String,
        required: [true, 'Name field is required!'],
        maxlength: 50
    },
    model_number: {
        type:String,
        required: [true,"Model number is required!"],
        unique:true
    },
    vehicle_number: {
        type:String,
        required: [true,"Vehicle number is required!"],
        unique:true
    },
    engine_number: {
        type:String,
        required: [true,"Engine number is required!"],
        unique:true
    },
    chassi_number: {
        type:String,
        required: [true,"Chassis number is required!"],
        unique:true
    },
    color: {
        type:String,
        required:true
    },
     vehicle_image: {
        type: String,
        required: false
    },
    
    created_date: {
        type: Date,
        default: Date.now
    },

});

const Vehicle = mongoose.model('Vehicle', VehicleModelSchema);
module.exports = { Vehicle }

