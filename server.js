const express = require("express");
const app = express();
const cors = require("cors")
const errorHandler = require('./core/errorHandler')
require("dotenv").config()

app.use(cors())
app.use(express.json());
require("./routes/index.routes")(app);
app.use(errorHandler)
app.listen(process.env.PORT || 8080, function () {
    console.log("CORS-enabled web server listening on port 8080");
});
