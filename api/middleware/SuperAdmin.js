const { SuperAdmin } = require("../models/SuperAdminModel");
const UserRole = require('../enums/UserRole');

exports.Auth = (req, res, next) => {
    let token = req.header('x-access-token') || req.header('authorization');
    // console.log(token);

    if(token) {
        if(token.startsWith('Bearer')) {
            token = token.slice(7, token.length);
        }

        SuperAdmin.findByToken(token, (err, superAdmin) => {
            if (err) throw err;

            if (!superAdmin) {
                res.status(400).json({
                    success: false,
                    message: "No valid token provided!"
                });
            }

            req.token = token;
            req.superAdmin = superAdmin;

            next();
        });
    } else {
        res.status(400).json({
            success: false,
            message: "No valid token provided!"
        });
    }
};


exports.SuperAdmin = (req, res, next) => {
    let token = req.header('x-access-token') || req.header('authorization');

    if(token) {
        if(token.startsWith('Bearer')) {
            token = token.slice(7, token.length);
        }

        SuperAdmin.findByToken(token, (err, superAdmin) => {
            if (err) throw err;

            if (superAdmin.role != UserRole.SUPER_ADMIN) {
                res.status(403).json({
                    success: false,
                    message: "No authorization to access this route!"
                });
            }

            next();
        });
    }
};


