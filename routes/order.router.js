const authMiddleware = require("../middlewares/auth.middleware")
const OrderController = require("../controllers/order.controller");

module.exports = (app) => {
    app.get("/order/user", authMiddleware, OrderController.listByUser);
    app.get("/order/partner", authMiddleware, OrderController.listByPartner);
    app.post("/order", authMiddleware, OrderController.create);
    app.delete("/order", authMiddleware, OrderController.cancel);
};
