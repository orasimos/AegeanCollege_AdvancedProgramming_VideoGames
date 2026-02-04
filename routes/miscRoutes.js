const express = require("express");
const miscController = require("../controllers/miscController");

const router = express.Router();

router.route('/companies').get(miscController.getCompanies);
router.route('/types').get(miscController.getTypes);
router.route('/consoles').get(miscController.getConsoles);

module.exports = router;



