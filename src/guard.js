module.exports = {
  protect(req, res, next) {
    if(req.session.isLogedIn) {
      next()
    } else {
      return res.status(401).send("Not Authorized")
    }
  }
}