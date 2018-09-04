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
  });
};
