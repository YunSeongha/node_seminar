var express = require("express");
var router = express.Router();
const userModel = require("../odm/users");

/* GET users listing. */
router.get("/", function (req, res) {
  userModel
    .find({}, { password: 0 })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.delete("/:id", function (req, res) {
  userModel
    .deleteOne({ id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/", function (req, res) {
  userModel
    .create(req.body)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = router;
