const financialController = require("../controllers/financial.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")
const UserMiddleware = require("../middlewares/authUser.middleware")

module.exports = (app) => {
    app.get("/banks",           financialController.getBanks);
    app.get("/business-areas",  financialController.getBusiness);
    app.get("/documents",       [authMiddleware, PartnerMiddleware], financialController.getDocuments);
    app.get("/balance",         [authMiddleware, PartnerMiddleware], financialController.getBalance);

    app.post("/digital-account", authMiddleware, financialController.createDigitalAccount);
}
