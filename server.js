const express = require("express");
const app = express();
require("dotenv").config()

app.use(express.json());
require("./routes/index.router")(app);

app.listen(8080, function () {
    console.log("CORS-enabled web server listening on port 8080");
});
