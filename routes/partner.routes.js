const PartnerController = require("../controllers/partner.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")

module.exports = (app) => {
    app.post("/partner", PartnerController.create);
    app.put("/partner", [authMiddleware, PartnerMiddleware], PartnerController.update);
    app.get("/partner", authMiddleware, PartnerController.list);
};
