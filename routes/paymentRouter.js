const PaymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/auth")

module.exports = (app) => {
    app.post("/payment", authMiddleware, PaymentController.sendPayment);
};
