const TokenizationController = require("../controllers/tokenizationController");
const authMiddleware = require("../middlewares/auth")

module.exports = (app) => {
    app.post("/tokenization", authMiddleware, TokenizationController.createTokenCard);
};
