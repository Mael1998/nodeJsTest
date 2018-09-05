require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "pug");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extend: false }));

require("./app/routes")(app);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${
      process.env.MONGO_HOST
    }:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(3000, () =>
      console.log("Example app listening on port http://localhost:3000/ !")
    );
  });
