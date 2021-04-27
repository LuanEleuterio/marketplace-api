const authController = require("../controllers/authenticateController");
const authMiddleware = require('../middlewares/auth')

module.exports = (app) => {
    app.post("/auth", authController.getAuth);
    app.get("/auth/verify", authMiddleware, authController.tokenVerify);
};
