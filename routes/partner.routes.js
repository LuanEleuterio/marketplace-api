const controller = require("../controllers/partner.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const authAdmMiddleware = require("../middlewares/authAdm.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")

module.exports = (app) => {
    app.post("/partner", controller.create);
    app.put("/partner", [authMiddleware, PartnerMiddleware], controller.update);
    app.get("/partner", authMiddleware, controller.list);
    app.get("/partners", [authMiddleware, authAdmMiddleware], controller.listAll);
};
