const domeCtrl = require("./../controllers/domeCtrl");
const router = require("express").Router();

router.route("/dome").post(domeCtrl.createdome).get(domeCtrl.getdome);

module.exports = router;
