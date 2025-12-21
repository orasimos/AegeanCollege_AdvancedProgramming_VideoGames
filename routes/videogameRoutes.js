const express = require("express");
const gamesController = require("../controllers/gamesController");
const authController = require("../controllers/authController");

const router = express.Router();

//Public
router.route('/top-5-rated').get(gamesController.getTop5VideoGames);
router.route('/by-type').get(gamesController.getVideoGamesByType)
router.route('/').get(gamesController.getAllVideoGames);
router.route('/:id', gamesController.getVideoGame);

//Protected
router.post('/', authController.protect, gamesController.insertVideoGame);
router.patch('/:id', authController.protect, gamesController.updateVideoGame);
router.delete('/:id', authController.protect, gamesController.deleteVideoGame);

module.exports = router;
