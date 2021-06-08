const controller = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.get("/user", authMiddleware, controller.list);
    app.put("/user", authMiddleware, controller.update);
    app.post("/user", controller.create);
};
