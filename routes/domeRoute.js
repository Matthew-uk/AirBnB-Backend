const domeCtrl = require("./../controllers/domeCtrl");
const router = require("express").Router();

router.route("/dome").post(domeCtrl.createdome).get(domeCtrl.getdome);

router.route("/dome/book").post(domeCtrl.book);
router.route("/dome/schedule").get(domeCtrl.schedule);

module.exports = router;
