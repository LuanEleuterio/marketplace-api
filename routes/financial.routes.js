const controller = require("../controllers/financial.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")

module.exports = (app) => {
    app.get("/banks",           controller.getBanks);
    app.get("/business-areas",  controller.getBusiness);
    app.get("/documents",       [authMiddleware, PartnerMiddleware], controller.getDocuments);
    app.get("/balance",         [authMiddleware, PartnerMiddleware], controller.getBalance);

    app.post("/digital-account", authMiddleware, controller.createDigitalAccount);
}
