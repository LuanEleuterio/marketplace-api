const authMiddleware = require("../middlewares/auth.middleware")
const controller = require("../controllers/order.controller");

module.exports = (app) => {
    app.put("/orders/cancel/:orderId", authMiddleware, controller.cancel);
    app.get("/orders/user", authMiddleware, controller.listByUser);
    app.get("/orders/partner", authMiddleware, controller.listByPartner);
    app.post("/orders", authMiddleware, controller.create);
};
