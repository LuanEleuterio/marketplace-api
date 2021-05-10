const AuthenticateRouter = require("./authenticate.router")
const UserRouter = require("./user.router")
const PartnerRouter = require("./partner.router")
const FinancialRouter = require("./financial.router")

module.exports = (app) => {
    AuthenticateRouter(app);
    UserRouter(app);
    PartnerRouter(app);
    FinancialRouter(app);
};
