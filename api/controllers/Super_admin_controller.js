const { SuperAdmin} = require("../models/SuperAdminModel");
const { ServiceAgent } = require("../models/ServiceAgentModel");
const { Customer } = require("../models/CustomerModel");
const { Vehicle } = require("../models/VehicleModel");
const { ServiceRecord } = require("../models/ServiceRecordModel");

exports.registerSuperAdmin = async ( req, res ) => {
    const superAdmin = new SuperAdmin(req.body);

    await superAdmin.save((err, doc) => {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Register failed, check the validation errors",
                data: err
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Super admin successfully Signed Up!"
            });
        }
    });
};

exports.loginSuperAdmin = async ( req, res ) => {
    SuperAdmin.findOne({
        $or:[
            {username:req.body.username},
            {email:req.body.email}
        ]
     }, (err, superAdmin) => {
        if (!superAdmin) {
            return res.status(404).json({ success: false, message: "User email or uername not found!" });
        } else {
            superAdmin.comparePassword(req.body.password, (err, isMatch) => {
                //isMatch is eaither true or false
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: "Wrong Password!" });
                } else {
                    superAdmin.generateToken((err, token) => {
                        if (err) {
                            return res.status(400).send({ 
                                'success': false,
                                 message: "Unable to generate jwt key!",
                                 data:err
                                });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: " Super Admin SuccessfullyLogged In!",
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
exports.logOutSuperAdmin = async ( req, res ) => {

        req.token=null;
        res.status(200).json({
            success: true,
            message: " Super Admin Successfully Logged Out!",
            data: {
                "token": req.token
            }
        });
}


//Manage service agents 
exports.createrServiceAgent = async ( req,res ) => {

        var newServiceAgent = new ServiceAgent(req.body);

        newServiceAgent.superAdmin = req.superAdmin._id;

        await newServiceAgent.save((err, serviceAgent) => {
            if (err) {
                return res.status(422).json({
                    success: false,
                    message: "Unable to create Service Agent!",
                    data: err
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "New Service Agent is created!",
                    data: serviceAgent
                });
            }
        });
};

exports.deleteServiceAgent = async ( req, res ) => {
    await ServiceAgent.remove({_id: req.params.id}, function(err, serviceAgent) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid Service Agent id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Service Agent deleted!"
        });
    });
}

exports.getAllServiceAgents = async (req, res) => {
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

//Manage all customers

exports.getAllCustomers = async (req, res) => {
    await Customer.find(function(err, customer) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to retrive customers!",
                data: err
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Received all customers!",
            data: customer
        });
    });
};

exports.deleteCustomer = async ( req, res ) => {
    await Customer.remove({_id: req.params.id}, function(err, customer) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid Customer id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Custoemr is deleted!"
        });
    });
};

//Manage all vehicles

exports.getAllCustomerVehicles = async (req, res) => {
    await Vehicle.find(function(err, vehicle) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to retrive customers' vehicles!",
                data: err
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Received all customers' vehicles!",
            data: vehicle
        });
    });
};

exports.deleteCustomerVehicle = async ( req, res ) => {
    await Vehicle.remove({_id: req.params.id}, function(err, vehicle) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid Vehicle id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Custoemr Vehicle is deleted!"
        });
    });
};

//Manage all vehicles service records

exports.getAllCustomerVehiclesRecords = async (req, res) => {
    await ServiceRecord.find(function(err, serviceRecord) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Unable to retrive customers' vehicle records!",
                data: err
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Received all customer vehicles records!",
            data: serviceRecord
        });
    });
};

exports.deleteCustomerVehicleRecord = async ( req, res ) => {
    await ServiceRecord.remove({_id: req.params.id}, function(err, serviceRecord) {
        if (err) {
            return res.status(422).json({
                success: false,
                message: "Invalid Vehicle Service record id!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Custoemr Vehicle Service Record is deleted!"
        });
    });
};


