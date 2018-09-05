const User = require("./models/User.model");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.post("/login", function(req, res) {
    console.log(req.body);
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.post("/signup", function(req, res) {
    console.log(req.body);
    User.signup(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.confirmPassword
    )
      .then(() => {
        res.redirect("/?signup=ok");
      })
      .catch(errors => {
        res.render("signup", { errors, user: req.body });
      });
  });
};
