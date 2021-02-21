module.exports = function(app) {

    const { Auth,SuperAdmin } = require("../middleware/SuperAdmin");
    const Super_admin_controller = require("../controllers/Super_admin_controller")
    
    app.post("/register-superAdmin",  Super_admin_controller.registerSuperAdmin);//Worked
    app.post("/login-superAdmin", Super_admin_controller.loginSuperAdmin);//Worked
    app.post("/logout-superAdmin",Auth,Super_admin_controller.logOutSuperAdmin); //Worked
    //Manage service agents
    app.post("/superAdmin/create-serviceAgent",[Auth,SuperAdmin],Super_admin_controller.createrServiceAgent);//Worked
    app.delete("/superAdmin/delete-serviceAgent/:id",[Auth,SuperAdmin],Super_admin_controller.deleteServiceAgent);//Worked
    app.get("/superAdmin/view-all-serviceAgents",[Auth,SuperAdmin],Super_admin_controller.getAllServiceAgents);//Worked
    
    //Manage all customers
    app.get("/superAdmin/view-all-customers",[Auth,SuperAdmin],Super_admin_controller.getAllCustomers);//Worked
    app.delete("/superAdmin/delete-customer/:id",[Auth,SuperAdmin],Super_admin_controller.deleteCustomer);//Worked
    
    //Manage all vehicles
    app.get("/superAdmin/view-all-vehicles",[Auth,SuperAdmin],Super_admin_controller.getAllCustomerVehicles);//Worked
    app.delete("/superAdmin/delete-vehicle/:id",[Auth,SuperAdmin],Super_admin_controller.deleteCustomerVehicle);//Worked

    //Manage all vehicle service records
    app.get("/superAdmin/view-all-vehicle-service-records",[Auth,SuperAdmin],Super_admin_controller.getAllCustomerVehiclesRecords);//Worked
    app.delete("/superAdmin/delete-vehicle-service-record/:id",[Auth,SuperAdmin],Super_admin_controller.deleteCustomerVehicleRecord);//Worked
};