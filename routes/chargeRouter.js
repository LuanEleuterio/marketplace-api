const ChargeController = require("../controllers/chargeController");
const authMiddleware = require("../middlewares/auth")

module.exports = (app) => {
    app.post("/charge", authMiddleware, ChargeController.createCharges);
};
