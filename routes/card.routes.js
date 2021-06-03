const CardsController = require("../controllers/card.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.delete("/cards/:cardId", authMiddleware, CardsController.delete);
    app.post("/cards", authMiddleware, CardsController.create);
    app.get("/cards", authMiddleware, CardsController.listAll);
};
