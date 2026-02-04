const express = require("express");
const gamesController = require("../controllers/gamesController");
const authController = require("../controllers/authController");

const router = express.Router();

//Public - Διαθέσιμα endpoints χωρίς να απαιτείται εξουσιοδότηση
router.route('/').get(gamesController.getAllVideoGames);
router.route('/search').get(gamesController.searchVideoGames);
router.route('/top-5-rated').get(gamesController.getTop5VideoGames);
router.route('/by-type').get(gamesController.getGrouppedByType)
router.route('/:id').get(gamesController.getVideoGameById);

//Protected - Είναι απαραίτητη η εξουσιοδότηση για την πρόσβαση σε αυτά
router.post('/', authController.authorize, gamesController.insertVideoGame);
router.route('/:id')
    .patch(authController.authorize, gamesController.updateVideoGame)
    .delete(authController.authorize, gamesController.deleteVideoGame);

module.exports = router;

