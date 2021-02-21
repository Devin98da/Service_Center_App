const { ServiceAgent } = require("../models/ServiceAgentModel");
const UserRole = require('../enums/UserRole');

exports.Auth = (req, res, next) => {
    let token = req.header('x-access-token') || req.header('authorization');

    if(token) {
        if(token.startsWith('Bearer')) {
            token = token.slice(7, token.length);
        }

        ServiceAgent.findByToken(token, (err, serviceAgent) => {
            if (err) throw err;

            if (!serviceAgent) {
                res.status(400).json({
                    success: false,
                    message: "No valid token provided!"
                });
            }

            req.token = token;
            req.serviceAgent = serviceAgent;

            next();
        });
    } else {
        res.status(400).json({
            success: false,
            message: "No valid token provided!"
        });
    }
};


exports.ServiceAgent = (req, res, next) => {
    let token = req.header('x-access-token') || req.header('authorization');

    if(token) {
        if(token.startsWith('Bearer')) {
            token = token.slice(7, token.length);
        }

        ServiceAgent.findByToken(token, (err, serviceAgent) => {
            if (err) throw err;

            // if (serviceAgent.role != UserRole.SERVICE_AGENT) {
            //     res.status(403).json({
            //         success: false,
            //         message: "No authorization to access this route!"
            //     });
            // }

            next();
        });
    }
};


