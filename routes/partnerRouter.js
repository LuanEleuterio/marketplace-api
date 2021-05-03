const PartnerController = require("../controllers/partnerController");

module.exports = (app) => {
    app.post("/register-partner", PartnerController.register);
};
