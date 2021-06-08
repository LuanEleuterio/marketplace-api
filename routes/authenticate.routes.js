const controller = require("../controllers/authenticate.controller");

module.exports = (app) => {
    app.post("/auth", controller.getAuth);
};
