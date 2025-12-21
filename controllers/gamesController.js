const VideoGame = require("../models/VideoGame");

exports.getTop5VideoGames = async (req, res) => {
    try {
        const top5Games = await VideoGame.find()
            .sort({ rating: -1 })
            .limit(5)
            .select('title rating company type');

        res.status(200).json({
            status: 'success',
            results: top5Games.length,
            data: { games: top5Games }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
}

exports.getVideoGamesByType = async (req, res) => {
    try {
        const videogames = await VideoGame.aggregate([
            {
                $group: {
                    _id: '$type',
                    numberOfGames: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    games: { $push: '$title' }
                }
            },
            {
                $sort: { avgRating: -1 }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: { videogames }
        })
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
}

exports.getAllVideoGames = async (req, res) => {
    try {
        const games = VideoGame.find();

        res.status(200).json({
            status: 'success',
            results: games.length,
            data: { games }
        })
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
}

exports.insertVideoGame = async (req, res) => {
    try {
        const newGame = await VideoGame.create(req.body);

        res.status({
            status: 'success',
            data: { game: newGame }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ status: 'fail', message: 'Game with the same title already exists.' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
}

exports.getVideoGame = async (req, res) => {
    try {
        const game = await VideoGame.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ status: 'fail', message: 'Game does not exist.' })
        }

        res.status(200).json({
            status: 'success',
            data: { game }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
}

exports.updateVideoGame = async (req, res) => {
    try {
        const updatedGame = await VideoGame.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedGame) {
            return res.status(404).json({ status: 'fail', message: 'Game does not exist.' });
        }

        res.status(200).json({
            status: 'success',
            data: { game }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
}

exports.deleteVideoGame = async (req, res) => {
    try {
        const deletedGame = await VideoGame.findByIdAndDelete(req.params.id);

        if (!deletedGame) {
            return res.status(404).json({ status: 'fail', message: 'Game does not exist' });
        }

        res.status(204).json({  //succes, no-content returned
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
}