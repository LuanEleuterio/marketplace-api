const PartnerController = require("../controllers/partner.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const PartnerMiddleware = require("../middlewares/authPartner.middleware")

module.exports = (app) => {
    app.get("/partner", authMiddleware, PartnerController.getPartner);
    app.get("/partner/orders", authMiddleware, PartnerController.getOrders);
    app.get("/partner/products", PartnerController.getProducts);
    app.get("/partner/product/:productId", PartnerController.getProduct);

    app.post("/partner/register", PartnerController.register);
    app.post("/product", [authMiddleware, PartnerMiddleware], PartnerController.createProduct);
};
