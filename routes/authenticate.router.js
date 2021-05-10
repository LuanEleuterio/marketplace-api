const authController = require("../controllers/authenticate.controller");

module.exports = (app) => {
    app.post("/auth", authController.getAuth);
};
