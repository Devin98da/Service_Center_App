var mongoose = require('mongoose');
const { ServiceAgent } = require('../middleware/ServiceAgent');
var Schema = mongoose.Schema;

var AppointmentModelSchema = new Schema({
    service_agent_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: ServiceAgent,
        required: [true, 'Service Agent field is required!']
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
    service_category: {
        type: String,
        enum: ['Oil/oil filter changed', 'Replace air filter', 'New tires', 'Battery replacement','Brake work','Engine tune-up'],
        required: [true, 'Service category field is required!']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        required: [true, 'Status field is required!'],
        default: 'Pending'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', AppointmentModelSchema);
module.exports = { Appointment }