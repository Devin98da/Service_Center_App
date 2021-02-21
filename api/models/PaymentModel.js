var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentModelSchema = new Schema({
    appointment_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment',
        required: [true, 'Appointment field is required!'],
        unique:true
    },
    price: {
        type: String,
        required: [true, 'Price field is required!']
    },
    bankCardNumber:{
        type:Number,
        required:[true, 'Baank Card Number field is required!'],
        unique:true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Completed', 'Failed'],
        // required: [true, 'Status field is required!'],
        default:'Pending'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', PaymentModelSchema);
module.exports = { Payment }