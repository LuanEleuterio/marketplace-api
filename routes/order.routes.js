const authMiddleware = require("../middlewares/auth.middleware")
const OrderController = require("../controllers/order.controller");

module.exports = (app) => {
    app.get("/orders/user", authMiddleware, OrderController.listByUser);
    app.get("/orders/partner", authMiddleware, OrderController.listByPartner);
    app.post("/orders", authMiddleware, OrderController.create);
    app.put("/orders/cancel/:orderId", authMiddleware, OrderController.cancel);
};
