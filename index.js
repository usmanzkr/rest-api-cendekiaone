const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const userRoute = require("./router/userRoute");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set route

//user
app.use("/api/user", userRoute);

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
