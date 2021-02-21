const { Customer } = require("../models/CustomerModel");
// const { User } = require("../models/UserModel");
const UserRole = require('../enums/UserRole');

exports.Auth = (req, res, next) => {
    let token = req.header('x-access-token') || req.header('authorization');
    // console.log(token);
    if(token) {
        if(token.startsWith('Bearer')) {
            token = token.slice(7, token.length);
        }

        Customer.findByToken(token, (err, customer) => {
            if (err) throw err;

            if (!customer) {
                res.status(400).json({
                    success: false,
                    message: "No valid token provided!"
                });
            }

            req.token = token;
            req.customer = customer;

            next();
        });
    } else {
        res.status(400).json({
            success: false,
            message: "No valid token provided!"
        });
    }
};


exports.Customer = (req, res, next) => {
    let token = req.header('x-access-token') || req.header('authorization');
    
    // if(token) {
    //     if(token.startsWith('Bearer')) {
    //         token = token.slice(7, token.length);
            
    //     }

        Customer.findByToken(token, (err, customer) => {
            if (err) throw err;

    //         if (customer.role != UserRole.CUSTOMER) {
    //             res.status(403).json({
    //                 success: false,
    //                 message: "No authorization to access this route!"
    //             });
            // }

            next();
        });
    // }
};

