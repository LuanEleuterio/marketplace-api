const PartnerController = require("../controllers/partner.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")

module.exports = (app) => {
    app.post("/register-partner", PartnerController.register);
    app.post("/product", [authMiddleware, PartnerMiddleware], PartnerController.createProduct);
};
