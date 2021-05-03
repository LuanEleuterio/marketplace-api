const BalanceRouter = require("./balanceRouter");
const AuthenticateRouter = require("./authenticateRouter")
const UserRouter = require("./userRouter")
const PartnerRouter = require("./partnerRouter")
const ChargeRouter = require("./chargeRouter")
const BankAndBusinessRouter = require("./bankAndBusinessRouter")
const PaymentRouter = require("./paymentRouter")
const DocumentRouter = require("./documentsRouter")
const TokenizationRouter = require("./tokenizationRouter")

module.exports = (app) => {
    BalanceRouter(app);
    AuthenticateRouter(app);
    UserRouter(app);
    PartnerRouter(app);
    ChargeRouter(app);    
    BankAndBusinessRouter(app);
    PaymentRouter(app);
    DocumentRouter(app);
    TokenizationRouter(app);
};
