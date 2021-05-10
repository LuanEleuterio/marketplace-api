const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.post("/register-user", UserController.register);
    app.post("/cancel-card", authMiddleware, UserController.cancelCard);
    app.get("/user", authMiddleware, UserController.getUser);
   
};
