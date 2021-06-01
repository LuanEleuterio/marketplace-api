const AuthenticateRouter = require("./authenticate.routes")
const UserRouter = require("./user.routes")
const PartnerRouter = require("./partner.routes")
const FinancialRouter = require("./financial.routes")
const OrderRouter = require("./order.routes")
const ProductRouter = require("./product.routes")
const CardRouter = require("./card.routes")

module.exports = (app) => {
    AuthenticateRouter(app);
    UserRouter(app);
    PartnerRouter(app);
    OrderRouter(app);
    ProductRouter(app);
    CardRouter(app);
    FinancialRouter(app);
};
