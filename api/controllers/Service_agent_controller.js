const { ServiceAgent } = require("../models/ServiceAgentModel");
const { ServiceRecord} = require("../models/ServiceRecordModel");
const { Appointment } = require("../models/AppointmentModel");
const { Customer } = require("../models/CustomerModel");
const { Vehicle } = require("../models/VehicleModel");

exports.loginServiceAgent = async ( req, res ) => {
    ServiceAgent.findOne({
        $or:[
            {username:req.body.username},
            {email:req.body.email}
        ]
     }, (err, serviceAgent) => {
        if (!serviceAgent) {
            return res.status(404).json({ success: false, message: "Service Agent email or uername not found!" });
        } else {
            serviceAgent.comparePassword(req.body.password, (err, isMatch) => {
                //isMatch is eaither true or false
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: "Wrong Password!" });
                } else {
                    serviceAgent.generateToken((err, token) => {
                        if (err) {
                            return res.status(400).send({ 
                                'success': false,
                                 message: "Unable to generate jwt key!",
                                 data:err
                                });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: " Service Agent SuccessfullyLogged In!",
                                data: {
                                    "token": token
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// Log out
exports.logOutServiceAgent = async ( req, res ) => {

    req.token=null;
    res.status(200).json({
        success: true,
        message: " Service Agent is Successfully Logged Out!",
        data: {
            "token": req.token
        }
    });
}


exports.createCustomerServiceRecord = async( req, res ) => {
    await Appointment.findById(req.body.appointment_id, async function(err, appointment) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid appointment id!"
            });
        }

        if(!appointment) {
            return res.status(422).json({
                success: false,
                message: "Invalid appointment id!"
            });
        }
        const newCustomerServiceRecord = new ServiceRecord(req.body);

        newCustomerServiceRecord.serviceAgent =  req.serviceAgent._id;

        await newCustomerServiceRecord.save((err, customerServiceRecord) => {
            if(err){
                 return res.status(422).json({
                    success: false,
                    message: "Unable to create customer service record!",
                    data:err
                 });
            }else{
                return res.status(200).json({
                    success: true,
                    message: "New customer service record is created!",
                    data:customerServiceRecord
                });
            }
        });
    });
};

exports.editCustomerServiceRecord = async( req, res ) => {
    await ServiceRecord.findOneAndUpdate({_id:req.params.id}, req.body, {new: true}, function(err, customerServiceRecord){
        if(err){
            return res.status(422).json({
                success: false,
                message: "Invalid customer service record id!"
            });
        }
        if(!customerServiceRecord){
            return res.status(422).json({
                success: false,
                message: "Invalid customer service record id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer Service Record is updated!",
            data: customerServiceRecord
        })
    });

};

exports.deleteCustomerServiceRecord = async( req, res ) => {
    await ServiceRecord.remove({_id: req.params.id}, function(err, customerServiceRecord){
        if(err){
            return res.status(422).json({
                success: false,
                message: "Invalid customer service rRecord id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer Service Record is deleted!"
        })
    });
};

exports.viewDailyAppointments = async( req, res ) => {
  
    await ServiceAgent.findById(req.params.id, async function(err, serviceAgent) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid Service Agent id!"
            });
        }

        if(!serviceAgent) {
            return res.status(422).json({
                success: false,
                message: "Invalid Service Agent id!"
            });
        }

   

    await Appointment.find({service_agent_id:req.params.id},function(err, appointments) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to retrive customer daily appointments!",
                data: err
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Received all customer daily appointments!",
            data: appointments
        });
    });
});
};

exports.ManageStatusOfAppointments = async ( req, res ) => {
    await Appointment.findOneAndUpdate({_id:req.params.id},{ $set: { status: req.body.status } }, {new: true}, function(err, appointment){
        if(err){
            return res.status(422).json({
                success: false,
                message: "Invalid customer apopointment id!"
            });
        }
        if(!Appointment){
            return res.status(422).json({
                success: false,
                message: "Invalid customer apopointment id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Customer Apopointment Status is updated!",
            data: appointment
        })
    });
};

//Search by customer name
exports.searchCustomers = (req, res) => {
    var searchKeyword = req.body.search;

    if(!searchKeyword) {
        return res.status(422).json({
            success: false,
            message: "Serach keyword is required!"
        });
    }
    
    Customer.find({
        $or: [
            {name: {$regex: searchKeyword, $options: 'i'}},
            {username: {$regex: searchKeyword, $options: 'i'}}
        ]
    }, function(err, customers){
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Error filteting customers!",
                data: err
            });
        }

          return res.status(422).json({
            success: true,
            message: "Filtered customers!",
            data: customers
        });
    });
};

//Search by Customer vehicles
exports.searchCustomerVehicles = (req, res) => {
    var searchKeyword = req.body.search;

    if(!searchKeyword) {
        return res.status(422).json({
            success: false,
            message: "Serach keyword is required!"
        });
    }
    
    Vehicle.find({
        $or: [
            {vehicle_name: {$regex: searchKeyword, $options: 'i'}},
            {vehicle_number: {$regex: searchKeyword, $options: 'i'}}
        ]
    }, function(err, customers){
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Error filteting vehicles!",
                data: err
            });
        }

          return res.status(422).json({
            success: true,
            message: "Filtered vehicles!",
            data: customers
        });
    });
};


//Search by Customer Service Record 
exports.searchCustomerServiceRecord = (req, res) => {
    var searchKeyword = req.body.search;

    if(!searchKeyword) {
        return res.status(422).json({
            success: false,
            message: "Serach keyword is required!"
        });
    }
    
    ServiceRecord.find({
        $or: [
            {service_details: {$regex: searchKeyword, $options: 'i'}},
            {service_category:{$regex:searchKeyword,$options: 'i'}}
        ]
    }, function(err, serviceRecords){
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Error filteting Service Records!",
                data: err
            });
        }

          return res.status(422).json({
            success: true,
            message: "Filtered Service Records!",
            data: serviceRecords
        });
    });
};

//Search by Customer Appointment 
exports.searchCustomerAppointment = (req, res) => {
        var searchKeyword = req.body.search;
    
        if(!searchKeyword) {
            return res.status(422).json({
                success: false,
                message: "Serach keyword is required!"
            });
        }
        
        Appointment.findById({
            $or: [
                {id: {$regex: searchKeyword, $options: 'i'}},
                // {vehicle_id: {$regex: searchKeyword, $options: 'i'}}
            // {service_category:{$regex:searchKeyword,$options: 'i'}}

            ]
        }, function(err, appointment){
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Error filteting appoointments!",
                    data: err
                });
            }
    
              return res.status(422).json({
                success: true,
                message: "Filtered appoointments!",
                data: appointment
            });
        });
    };