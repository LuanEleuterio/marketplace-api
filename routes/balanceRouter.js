const BalanceController = require("../controllers/balanceController");
const authMiddleware = require("../middlewares/auth")

module.exports = (app) => {
    app.get("/balance", authMiddleware ,BalanceController.getBalance);
};
