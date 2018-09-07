const User = require("./models/User.model");

module.exports = function(app, passport) {
  app.use((req, res, next) => {
    app.locals.user = req.user; // Récupération de l'objet 'user' (sera existant si une session est ouverte, et undefined dans le cas contraire)
    next();
  });

  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  // Lorsqu'on tente de se connecter, c'est le middleware de passport qui prend la main, avec la stratégie "locale" (configurée dans ./passport.js )
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      badRequestMessage: "Identifiants non valides!",
      failureFlash: true,
      successFlash: { message: "Connexion réussie. Bienvenue !" }
    })
  );

  app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Déconnexion réussie");
    res.redirect("/");
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.post("/signup", function(req, res) {
    User.signup(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req.body.confirmPassword
    )
      .then(() => {
        req.flash(
          "success",
          "Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
        res.redirect("/?signup=ok");
      })
      .catch(errors => {
        res.render("signup", { errors, user: req.body });
      });
  });
};
