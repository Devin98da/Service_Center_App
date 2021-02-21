var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const { ServiceTag } = require("./ServiceTagModel");

var ServiceRecordModelSchema = new Schema({
    service_category: {
        type: String,
        enum: ['Oil/oil filter changed', 'Replace air filter', 'New tires', 'Battery replacement','Brake work','Engine tune-up'],
        required: [true, 'Service category field is required!']
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer',
        required: [true, 'Customer field is required!']
    },
    vehicle_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vehicle',
        required: [true, 'Vehicle field is required!']
    },
    appointment_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment',
        required: [true, 'Appointment field is required!'],
        unique:true
    },
    service_details: {
        type: String, 
        required: [true,'Service details required!'], 
    },
    
    // service_agent: {
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'ServiceAgent',
    //     required: [true, 'Beautician field is required!']
    // },
    created_date: {
        type: Date,
        default: Date.now
    }
});

// ServiceRecordModelSchema.index({
//     title: 'text',
//     description: 'text',
// }, {
//     weights: {
//         title: 3,
//         description: 5,
//     },
// });

const ServiceRecord = mongoose.model('ServiceRecord', ServiceRecordModelSchema);
module.exports = { ServiceRecord }