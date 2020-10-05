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
            .createToken({ id: user.id, name: user.name })
            .then((token) => {
              res
                .cookie("token", token, { maxAge: 60000, httpOnly: true })
                .status(200)
                .json({ id: user.id, name: user.name });
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

module.exports = router;
