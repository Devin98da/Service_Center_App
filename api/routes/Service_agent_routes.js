module.exports = function(app) {

    const { Auth, ServiceAgent } = require("../middleware/ServiceAgent");
    const ServiceAgentController = require("../controllers/Service_agent_controller")
    
    app.post("/login-serviceAgent", ServiceAgentController.loginServiceAgent);//Worked
    app.post("/logout-serviceAgent",Auth,ServiceAgentController.logOutServiceAgent); //Worked
    app.post("/serviceAgent/create-customer-service-record",[Auth,ServiceAgent],ServiceAgentController.createCustomerServiceRecord);//Worked
    app.patch("/serviceAgent/edit-customer-service-record/:id",[Auth,ServiceAgent],ServiceAgentController.editCustomerServiceRecord);//Worked
    app.delete("/serviceAgent/delete-customer-service-record/:id",[Auth,ServiceAgent],ServiceAgentController.deleteCustomerServiceRecord);//Worked
    app.get("/serviceAgent/view-all-daily-appointments/:id",[Auth,ServiceAgent],ServiceAgentController.viewDailyAppointments)//Worked
    app.patch("/serviceAgent/manage-status-of-appointments/:id",[Auth,ServiceAgent],ServiceAgentController.ManageStatusOfAppointments);//Worked
    app.post("/serviceAgent/search-customer",[Auth,ServiceAgent],ServiceAgentController.searchCustomers);//Worked
    app.post("/serviceAgent/search-customer-vehicle",[Auth,ServiceAgent],ServiceAgentController.searchCustomerVehicles);//Worked
    app.post("/serviceAgent/search-customer-service-record",[Auth,ServiceAgent],ServiceAgentController.searchCustomerServiceRecord);//Worked
    app.post("/serviceAgent/search-customer-appointment",[Auth,ServiceAgent],ServiceAgentController.searchCustomerAppointment);//Worked


};