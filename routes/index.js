const BalanceRouter = require("./balanceRouter");
const AuthenticateRouter = require("./authenticateRouter")
const UserRouter = require("./userRouter")

module.exports = (app) => {
    BalanceRouter(app);
    AuthenticateRouter(app);
    UserRouter(app);
};
