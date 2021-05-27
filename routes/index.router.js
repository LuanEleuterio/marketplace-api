const AuthenticateRouter = require("./authenticate.router")
const UserRouter = require("./user.router")
const PartnerRouter = require("./partner.router")
const FinancialRouter = require("./financial.router")
const OrderRouter = require("./order.router")
const ProductRouter = require("./product.router")
const CardRouter = require("./card.router")

module.exports = (app) => {
    AuthenticateRouter(app);
    UserRouter(app);
    PartnerRouter(app);
    OrderRouter(app);
    ProductRouter(app);
    CardRouter(app);
    FinancialRouter(app);
};
