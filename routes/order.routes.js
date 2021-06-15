const authMiddleware = require("../middlewares/auth.middleware")
const authAdmMiddleware = require("../middlewares/authAdm.middleware")
const controller = require("../controllers/order.controller");

module.exports = (app) => {
    app.put("/orders/cancel", authMiddleware, controller.cancel);
    app.get("/orders/all", [authMiddleware, authAdmMiddleware], controller.listAll);
    app.get("/orders/user", authMiddleware, controller.listByUser);
    app.get("/orders/partner", authMiddleware, controller.listByPartner);
    app.post("/orders", authMiddleware, controller.create);
};
