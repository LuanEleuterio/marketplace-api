const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")
const ProductController = require("../controllers/product.controller");

module.exports = (app) => {
    app.get("/products/partner", [authMiddleware, PartnerMiddleware], ProductController.listByPartner);
    app.get("/product/shipping", ProductController.shipping);
    
    app.delete("/product/:productId", authMiddleware, ProductController.delete);
    app.get("/product/:productId", ProductController.list);

    app.post("/products-in", ProductController.listIn);
    app.get("/products", ProductController.listAll);
    app.post("/product", [authMiddleware, PartnerMiddleware], ProductController.create);
    app.put("/product", authMiddleware, ProductController.update);
};
