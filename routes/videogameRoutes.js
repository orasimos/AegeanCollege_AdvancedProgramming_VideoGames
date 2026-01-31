const express = require("express");
const gamesController = require("../controllers/gamesController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/companies').get(gamesController.getCompanies);
router.route('/types').get(gamesController.getTypes);
router.route('/consoles').get(gamesController.getConsoles);

//Public
router.route('/top-5-rated').get(gamesController.getTop5VideoGames);
router.route('/by-type').get(gamesController.getVideoGamesByType)
router.route('/all-videogames').get(gamesController.getAllVideoGames);
router.route('/search').get(gamesController.searchVideoGames);
router.route('/:id').get(gamesController.getVideoGameById);

//Protected
router.post('/', authController.authorize, gamesController.insertVideoGame);
router.route('/:id')
    .patch(authController.authorize, gamesController.updateVideoGame)
    .delete(authController.authorize, gamesController.deleteVideoGame);

module.exports = router;
