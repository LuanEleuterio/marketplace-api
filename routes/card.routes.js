const controller = require("../controllers/card.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.delete("/cards/:cardId", authMiddleware, controller.delete);
    app.post("/cards", authMiddleware, controller.create);
    app.get("/cards", authMiddleware, controller.listAll);
};
