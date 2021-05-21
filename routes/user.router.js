const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.get("/user", authMiddleware, UserController.getUser);
    app.get("/user/orders", authMiddleware, UserController.getOrders);
    app.get("/user/cards", authMiddleware, UserController.getCards);

    app.post("/user", UserController.register);
    app.put("/user", authMiddleware, UserController.updateUser);
    app.put("/user/card/cancel/:cardId", authMiddleware, UserController.cancelCard);
};
