const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/auth/spotify",
    passport.authenticate("spotify", {
      scope: ["playlist-modify-public", "playlist-modify-private"],
      showDialog: true,
    })
  );

  app.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
