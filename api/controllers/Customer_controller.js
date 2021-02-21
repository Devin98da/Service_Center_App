const { Customer} = require("../models/CustomerModel");
const { Vehicle } = require("../models/VehicleModel");
const { Appointment } = require("../models/AppointmentModel");
const { ServiceAgent} = require("../models/ServiceAgentModel");
const { ServiceRecord } = require("../models/ServiceRecordModel");
const { Payment } = require("../models/PaymentModel");

exports.registerCustomer = async ( req, res ) => {
    const customer = new Customer(req.body);

    await customer.save((err, doc) => {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Register failed, check the validation errors",
                data: err
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Customer successfully Signed Up!"
            });
        }
    });
};

exports.loginCustomer = async ( req, res ) => {
    Customer.findOne({
        $or:[
            {username:req.body.username},
            {email:req.body.email}
        ]
     }, (err, customer) => {
        if (!customer) {
            return res.status(404).json({ success: false, message: "User email or uername not found!" });
        } else {
            customer.comparePassword(req.body.password, (err, isMatch) => {
                //isMatch is eaither true or false
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: "Wrong Password!" });
                } else {
                    customer.generateToken((err, token) => {
                        if (err) {
                            return res.status(400).send({ 
                                'success': false,
                                 message: "Unable to generate jwt key!",
                                 data:err
                                });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Successfully Customer Logged In!",
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
exports.logOutCustomer = async ( req, res ) => {

    req.token=null;
    res.status(200).json({
        success: true,
        message: " Customer is Successfully Logged Out!",
        data: {
            "token": req.token
        }
    });
}


exports.getCustomerDetails= (req, res) => {
    res.json({status: true, message: "Customer Received!", data: req.customer});
};

//Add vehicle

exports.addVehicle = async (req, res) => {

        var newVehicle = new Vehicle(req.body);

        newVehicle.customer = req.customer._id;

        await newVehicle.save((err, vehicle) => {
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Unable to add vehicle!",
                    data: err
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "New vehicle is added!",
                    data: vehicle
                });
            }
        });
};
exports.getAllVehicles = async (req, res) => {
    await Vehicle.find(function(err, vehicles) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to retrive vehicles!",
                data: err
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Received vehicles!",
            data: vehicles
        });
    });
};

exports.editVehicle = async (req, res) => {
    await Vehicle.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, vehicle) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid vehicle id!"
            });
        }

        if(!vehicle) {
            return res.status(422).json({
                success: false,
                message: "Invalid vehicle id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle updated!",
            data: vehicle
        });
    });
};
exports.deleteVehicle = async (req, res) => {
    await Vehicle.remove({_id: req.params.id}, function(err, vehicle) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid vehicle id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vehicle deleted!"
        });
    });
};

exports.viewAllServiceAgents = async ( req, res ) =>{
    await ServiceAgent.find(function(err, serviceAgents) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to retrive service agents!",
                data: err
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Received all service agents!",
            data: serviceAgents
        });
    });
};

exports.MakeAppointment = async ( req, res ) =>{
    const data=req.body;
    console.log(data);
    await ServiceAgent.findById(req.body.service_agent_id, async function(err, serviceAgent) {
        console.log(serviceAgent+"51424");
        
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid service agent id!"
            });
        }

        if(!serviceAgent) {
            return res.status(422).json({
                success: false,
                message: "Invalid service agent id!"
            });
        }

    var newAppointment = new Appointment(req.body);

    newAppointment.customer = req.customer._id;

        await newAppointment.save((err, appointment) => {
            if (err) {
                console.log(appointment);
                return res.status(422).json({
                    success: false,
                    message: "Unable to make appointment!",
                    data: err
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "New appointment is made!",
                    data: appointment
                });
            }
        });
    });
};

exports.viewAllVehicleServiceRecords = async ( req, res ) =>{

    await Customer.findById(req.params.id, async function(err, customer) {
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Invalid customer id!"
                });
            }

            if(!customer) {
                return res.status(422).json({
                    success: false,
                    message: "Invalid customer id!"
                });
            }


        await ServiceRecord.find({customer_id:req.params.id},function(err, serviceRecords) {
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Unable to retrive vehicle service records!",
                    data: err
                });
            }
        
            return res.status(200).json({
                success: true,
                message: "Received all vehicle service records!",
                data: serviceRecords
            });
        });
    });
};
//Search by Service Agent
exports.searchServiceAgent = (req, res) => {
    var searchKeyword = req.body.search;

    if(!searchKeyword) {
        return res.status(422).json({
            success: false,
            message: "Serach keyword is required!"
        });
    }
    
    ServiceAgent.find({
        $or: [
            {agent_name: {$regex: searchKeyword, $options: 'i'}},
            {username: {$regex: searchKeyword, $options: 'i'}}
        ]
    }, function(err, serviceAgents){
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Error filteting Service Agents!",
                data: err
            });
        }

          return res.status(422).json({
            success: true,
            message: "Filtered Service Agents!",
            data: serviceAgents
        });
    });
};

// Make online payment
exports.makeOnlinePayment = (req,res) => {
    const data=req.body;
    console.log(data);
     Appointment.findById(req.body.appointment_id, async function(err, appointment) {
        console.log(appointment);
        
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid appointment id!"
            });
        }

        if(!appointment) {
            return res.status(422).json({
                success: false,
                message: "Invalid customer id!"
            });
        }

    var newPayment = new Payment(req.body);

    newPayment.customer = req.customer._id;

    await newPayment.save((err, payment) => {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to made payment!",
                data: err
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Payement is made succesfully!",
                data: payment
            });
        }
    });
});
};
