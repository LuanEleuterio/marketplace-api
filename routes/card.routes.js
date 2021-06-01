const CardsController = require("../controllers/card.controller");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    app.delete("/card/:cardId", authMiddleware, CardsController.delete);
    app.post("/card", authMiddleware, CardsController.create);
    app.get("/cards", authMiddleware, CardsController.listAll);

};
