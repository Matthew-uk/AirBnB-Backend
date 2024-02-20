const domeCtrl = require("./../controllers/domeCtrl");
const router = require("express").Router();

router.route("/dome").post(domeCtrl.createdome);

module.exports = router;
