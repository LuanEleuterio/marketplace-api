const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")
const ProductController = require("../controllers/product.controller");

module.exports = (app) => {
    app.get("/products/partner", [authMiddleware, PartnerMiddleware], ProductController.listByPartner);
    app.get("/products/shipping", ProductController.shipping);
    
    app.delete("/products/:productId", authMiddleware, ProductController.delete);
    app.get("/products/:productId", ProductController.list);

    app.post("/products-in", ProductController.listIn);
    app.get("/products", ProductController.listAll);
    app.post("/products", [authMiddleware, PartnerMiddleware], ProductController.create);
    app.put("/products", authMiddleware, ProductController.update);
};
