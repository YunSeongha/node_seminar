var express = require("express");
var router = express.Router();

const userModel = require("../odm/users");
const authModule = require("../modules/auth");

/* GET home page. */
router.post("/", function (req, res) {
  userModel
    .findOne({ id: req.body.id })
    .then((user) => {
      if (!user) return res.sendStatus(404);
      user.comparePassword(req.body.password, (err, isMatched) => {
        if (err) return res.sendStatus(400);

        if (isMatched) {
          authModule
            .createToken({ id: user.id, name: user.name, role: user.role })
            .then((token) => {
              res
                .cookie("token", token, { maxAge: 7200000, httpOnly: true })
                .status(200)
                .json({ id: user.id, name: user.name, role: user.role });
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(400);
            });
        } else {
          res.sendStatus(403);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/refresh", function (req, res) {
  authModule
    .decodeToken(req.cookies.token)
    .then((decoded) => {
      if (decoded) {
        authModule
          .createToken({
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
          })
          .then((token) => {
            res
              .cookie("token", token, {
                maxAge: 2 * 60 * 60 * 1000,
                httpOnly: true,
              })
              .status(200)
              .json({ id: decoded.id, name: decoded.name, role: decoded.role });
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/logout", function (req, res) {
  res.clearCookie("token").sendStatus(200);
});

module.exports = router;
