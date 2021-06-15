const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authAdmMiddleware = require("../middlewares/authAdm.middleware")

module.exports = (app) => {
    app.get("/users", [authMiddleware, authAdmMiddleware], controller.listAll);
    app.get("/user", authMiddleware, controller.list);
    app.put("/user", authMiddleware, controller.update);
    app.post("/user", controller.create);
};
