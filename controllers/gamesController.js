const VideoGame = require("../models/VideoGame");

exports.getAllVideoGames = async (req, res) => {
    try {
        const games = await VideoGame.find();

        res.status(200).json({
            status: "success",
            results: games.length,
            data: { games },
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err.message });
    }
};

exports.searchVideoGames = async (req, res) => {
    try {
        //Εκχώρηση των query params του request σε σταθερές
        //Έτσι γίνεται εύκολος ο έλεγχος για undefined
        const { title, minReleaseYear, maxReleaseYear, minRating, maxRating, online, company, type, minCompletionTime, maxCompletionTime, minPrice, maxPrice, consoles, difficulty, genreTags, multiplayerModes, languages, awards, availableOnStore, sort } = req.query;

        //Δυναμική δημιουργία του φίλτρου με βάση τις παραμέτρους του request
        //Αν η παράμετρος υπάρχει τότε λαμβάνεται υπόψιν στο φίλτρο.
        let filter = {};

        //Όνομα παιχνιδιού με Regex και case insensitivity
        if (title) filter.title = { $regex: title, $options: "i" };

        //Ορισμός φίλτρων εύρους
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

        //Boolean φίλτρα online και availableOnStore
        if (online !== undefined) filter.online = online;
        if (availableOnStore !== undefined) filter.availableOnStore = availableOnStore;

        //Συγκριτικά 1:1 φίλτρα
        if (company) filter.company = company;
        if (difficulty) filter.difficulty = difficulty;

        //Φίλτρα συμπερίληψης
        if (type) filter.type = { $all: type.split(",").map((s) => s.trim()) };
        if (consoles) filter.consoles = { $all: consoles.split(",").map((s) => s.trim()) };
        if (genreTags) filter.genreTags = { $all: genreTags.split(",").map((s) => s.trim()) };
        if (multiplayerModes) filter.multiplayerModes = { $all: multiplayerModes.split(",").map((s) => s.trim()) };
        if (languages) filter.languages = { $all: languages.split(",").map((s) => s.trim()) };
        if (awards) filter.awards = { $all: awards.split(",").map((s) => s.trim()) };

        //Αν το object του φίλτρου είναι κενό επιστρέφεται το αποτέλεσμα της getAllVideoGames()
        if (!Object.keys(filter).length) return await this.getAllVideoGames(req, res);

        //Σύνθεση του query
        //Εκχώρηση του query αναζήτησης με το φίλτρο σε μεταβλητή
        let query = VideoGame.find(filter);
        //Ταξινόμηση με βάση την παράμετρο "sort"αν υπάρχει, διαφορετικά με ημ/νία δημιουργίας
        if (sort) {
            const sortBy = sort.split(",".join(" "));
            query.sort(sortBy);
        } else {
            query.sort("-createdAt");
        }

        //Εκτέλεση του query
        const games = await query;

        //Επιστροφή αποτελεσμάτων
        res.status(200).json({
            status: "success",
            results: games.length,
            data: { games },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.getTop5VideoGames = async (req, res) => {
    try {
        const top5Games = await VideoGame
            //Ανάκτηση όλων
            .find()
            //Ταξινόμιση βάσει rating κατά φθίνουσα σειρά
            .sort({ rating: -1 })
            //Επιλογή των 5 πρώτων αποτελεσμάτων
            .limit(5)
            //Επιλογή μόνο των συγκεκριμένων πεδίων
            .select("title rating company type");

        res.status(200).json({
            status: "success",
            results: top5Games.length,
            data: { games: top5Games },
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err.message });
    }
};

exports.getGrouppedByType = async (req, res) => {
    try {
        const videogames = await VideoGame.aggregate([
            {
                //Δημιουργία group
                $group: {
                    //Χρήση του πεδίου type ως κλειδί του κάθε group
                    _id: "$type",
                    //Υπολογισμός του πλήθους
                    gamesCount: { $sum: 1 },
                    //Υπολογισμούς του μέσου rating
                    averageRating: { $avg: "$rating" },
                    //Δημιουργία string[] με τους τίτλους των παιχνιδιών
                    gameTitles: { $push: "$title" },
                },
            },
            //Ταξινόμηση των groups κατά φθίνον rating
            { $sort: { averageRating: -1 } },
        ]);

        res.status(200).json({
            status: "success",
            results: videogames.length,
            data: { videogames },
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err.message });
    }
};

exports.getVideoGameById = async (req, res) => {
    try {
        const game = await VideoGame.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ status: "fail", message: "Game does not exist." });
        }

        res.status(200).json({
            status: "success",
            data: { game },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.insertVideoGame = async (req, res) => {
    try {
        const newGame = await VideoGame.create(req.body);

        res.status(201).json({
            status: "success",
            data: { game: newGame },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                status: "fail",
                message: "Game with the same title already exists.",
            });
        }
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.updateVideoGame = async (req, res) => {
    try {
        const updatedGame = await VideoGame.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedGame) {
            return res.status(404).json({ status: "fail", message: "Game does not exist." });
        }

        res.status(200).json({
            status: "success",
            data: { updatedGame },
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};

exports.deleteVideoGame = async (req, res) => {
    try {
        const deletedGame = await VideoGame.findByIdAndDelete(req.params.id);

        if (!deletedGame) {
            return res.status(404).json({ status: "fail", message: "Game does not exist" });
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(400).json({ status: "fail", message: err.message });
    }
};
