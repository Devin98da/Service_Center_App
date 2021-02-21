var express = require('express');
var router = express.Router();

router.get('/',function (req,res){
    res.send("Welcome to Service Center API!");
});


require('./Customer_routes')(router);
require('./Service_agent_routes')(router);
require('./Super_admin_routes')(router);

module.exports.router = router;


