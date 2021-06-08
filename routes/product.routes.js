const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")
const controller = require("../controllers/product.controller");

module.exports = (app) => {
    app.get("/products/partner", [authMiddleware, PartnerMiddleware], controller.listByPartner);
    app.get("/products/shipping", controller.shipping);
    
    app.delete("/products/:productId", authMiddleware, controller.delete);
    app.get("/products/:productId", controller.list);

    app.post("/products-in", controller.listIn);
    app.get("/products", controller.listAll);
    app.post("/products", [authMiddleware, PartnerMiddleware], controller.create);
    app.put("/products", authMiddleware, controller.update);
};
