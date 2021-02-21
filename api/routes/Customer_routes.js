module.exports = function(app) {
    const { Auth,Customer } = require("../middleware/Customer");
    const Customer_controller = require("../controllers/Customer_controller");
    
    app.post("/register-customer",Customer_controller.registerCustomer);//Worked
    app.post("/login-customer",Customer_controller.loginCustomer);//Worked
    app.post("/logout-customer",Auth,Customer_controller.logOutCustomer); //Worked
    app.get("/customer",[Auth,Customer],Customer_controller.getCustomerDetails);//Worked
    app.post("/customer/add-vehicle",[Auth,Customer],Customer_controller.addVehicle);//Worked
    app.get("/customer/vehicles", [Auth, Customer], Customer_controller.getAllVehicles);//Worked
    app.patch("/customer/edit-vehicle/:id",[Auth,Customer],Customer_controller.editVehicle);//Worked
    app.delete("/customer/delete-vehicle/:id",[Auth,Customer],Customer_controller.deleteVehicle);//Worked
    app.get("/customer/viewAllServiceAgents",[Auth,Customer],Customer_controller.viewAllServiceAgents)//Worked
    app.post("/customer/make-appointment",[Auth,Customer],Customer_controller.MakeAppointment);//Worked
    app.get("/customer/view-all-vehicle-service-records/:id",[Auth,Customer], Customer_controller.viewAllVehicleServiceRecords);//Worked
    app.post("/customer/search-service-agent",[Auth,Customer],Customer_controller.searchServiceAgent);//Worked
    app.post("/customer/make-online-payments",[Auth,Customer],Customer_controller.makeOnlinePayment);//Worked

};