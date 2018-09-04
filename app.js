const express = require("express");
const app = express();

app.use(express.static('public'));
app.set("view engine", "pug");

app.get("/", function(req, res) {
  res.render("index", {title: 'nodeapp'});
});

app.get("/login", function(req, res) {
  res.render("login", {title: 'nodeapp'});
});

app.get("/signup", function(req, res) {
  res.render("signup", { title: "nodeapp"});
});

app.listen(3000, () =>
  console.log("Example app listening on port http://localhost:3000/ !")
);
