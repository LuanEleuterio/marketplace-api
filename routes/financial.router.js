const financialController = require("../controllers/financial.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")
const UserMiddleware = require("../middlewares/authUser.middleware")

module.exports = (app) => {
    app.get("/banks",           financialController.getBanks);
    app.get("/business-areas",  financialController.getBusiness);
    app.get("/documents",       [authMiddleware, PartnerMiddleware], financialController.getDocuments);
    app.get("/balance",         [authMiddleware, PartnerMiddleware], financialController.getBalance);

    app.post("/documents",         authMiddleware, financialController.sendDocuments);
    app.post("/order",         authMiddleware, financialController.createOrder);
    app.post("/payment",        [authMiddleware, UserMiddleware], financialController.sendPayment);
    app.post("/tokenization",   authMiddleware, financialController.cardTokenization);

    app.put("/cancel-order",   authMiddleware, financialController.cancelOrder);
}
