const DocumentsController = require("../controllers/documentsController");
const authMiddleware = require("../middlewares/auth")

module.exports = (app) => {
    app.get("/documents", authMiddleware, DocumentsController.getDocuments);
};
