const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.get("/user", authMiddleware, UserController.list);
    app.put("/user", authMiddleware, UserController.update);
    app.post("/user", UserController.create);
};
