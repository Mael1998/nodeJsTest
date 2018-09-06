require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require('connect-flash');

const app = express();

app.set("view engine", "pug");
/* middleware s'execute avant d'arrive jusqu'au client pour verifier que le client est admin ou pas
 app.use('/admin', (req, res, next) => {
  if(isNotAdmin){
    req.flash('danger', 'Acces interdit')
    return res.redirect('/')
  } else {
    next()
  }
}) */
app.use(
  session({
    secret: "opendata3wa rocks",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);
app.use(flash());
app.use((req, res, next) => {
  app.locals.flashMessages = req.flash()
  next()
})
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extend: false }));

require('./app/routes')(app)

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
