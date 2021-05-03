const bankAndBusinessController = require("../controllers/bankAndBusinessController");

module.exports = (app) => {
    app.get("/banks", bankAndBusinessController.getBanks);
    app.get("/business-areas", bankAndBusinessController.getBusiness);
};
