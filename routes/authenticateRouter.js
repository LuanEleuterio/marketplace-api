const authController = require("../controllers/authenticateController");

module.exports = (app) => {
    app.post("/auth", authController.getAuth);
};
