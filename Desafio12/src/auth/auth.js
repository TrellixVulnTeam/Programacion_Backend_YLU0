export function auth(req, res, next) {
    if (req.session.name) {
      next();
    } else {
      res.redirect("/login");
    }
  }