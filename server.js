const express = require("express");
const cors = require("cors");
const app = express();

//app.use(cors());

app.use(express.json());
require("./routes/index")(app);

app.listen(8080, function () {
    console.log("CORS-enabled web server listening on port 8080");
});
