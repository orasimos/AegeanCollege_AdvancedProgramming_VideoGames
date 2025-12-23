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
        const games = await VideoGame.find();

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

exports.getVideoGameById = async (req, res) => {
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

exports.searchVideoGames = async (req, res) => {
    try {
        const {
            title,
            
            minReleaseYear,
            maxReleaseYear,

            minRating,
            maxRating,

            online,
            company,
            type,

            minCompletionTime,
            maxCompletionTime,

            minPrice,
            maxPrice,

            consoles,
            difficulty,
            genreTags,
            multiplayerModes,
            languages,
            awards,
            availableOnStore,

            sort
        } = req.query

        let filter = {};

        if (title)
            filter.title = { $regex: title, $options: 'i' } //'i' for case insensitive
        
        if (minReleaseYear || maxReleaseYear) {
            filter.releaseYear = {};
            if (minReleaseYear) filter.releaseYear.$gte = Number(minReleaseYear);
            if (maxReleaseYear) filter.releaseYear.$lte = Number(maxReleaseYear);
        }
        
        if (minRating || maxRating) {
            filter.rating = {};
            if (minRating) filter.rating.$gte = Number(minRating);
            if (maxRating) filter.rating.$lte = Number(maxRating);
        }

        if (minCompletionTime || maxCompletionTime) {
            filter.completionTime = {};
            if (minCompletionTime) filter.completionTime.$gte = Number(minCompletionTime);
            if (maxCompletionTime) filter.completionTime.$lte = Number(maxCompletionTime);
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        
        if (online !== undefined) filter.online = online;
        if (availableOnStore !== undefined) filter.availableOnStore = availableOnStore;

        if (company) filter.company = company;
        if (type) filter.type = type;
        if (difficulty) filter.difficulty = difficulty;
        
        if (consoles) filter.consoles = { $all: consoles.split(',').map(s => s.trim()) };
        if (genreTags) filter.genreTags = { $all: genreTags.split(',').map(s => s.trim()) };
        if (multiplayerModes) filter.multiplayerModes = { $all: multiplayerModes.split(',').map(s => s.trim()) };
        if (languages) filter.languages = { $all: languages.split(',').map(s => s.trim()) };
        if (awards) filter.awards = { $all: awards.split(',').map(s => s.trim()) };
        

        let query = VideoGame.find(filter);
        if (sort) {
            const sortBy = sort.split(','.join(' '));
            query.sort(sortBy);
        } else {
            query.sort('-createdAt');
        }

        const games = await query;

        res.status(200).json({
            status: 'success',
            results: games.length,
            data: { games }
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