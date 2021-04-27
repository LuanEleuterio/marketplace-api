const UserController = require("../controllers/userController");

module.exports = (app) => {
    app.post("/register" , UserController.register);
};
