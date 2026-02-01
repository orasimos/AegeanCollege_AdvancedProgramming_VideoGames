const fs = require("fs");
const VideoGame = require("../models/VideoGame");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const json = "./data/video_games_dataset.json";

const initializeVideoGames = async () => {
    try {
        const initialize = process.argv.includes("--initialize");
        const gamesCount = await VideoGame.countDocuments();
        const usersCount = await User.countDocuments();

        if (!initialize) return;

        console.info("Initializing database...");
        if (gamesCount > 0) {
            console.info(`Deleting ${gamesCount} existing games...`);
            await VideoGame.deleteMany();
        }
        if (usersCount > 0) {
            console.info(`Deleting ${usersCount} existing users...`);
            await User.deleteMany();
        }

        const data = fs.readFileSync(json, "utf-8");
        const videoGames = JSON.parse(data);

        const res = await VideoGame.insertMany(videoGames);
        console.log(`Inserted ${res.length} games successfully!`);
    } catch (err) {
        console.error("Data initialization failed: ", err);
    }
};

module.exports = initializeVideoGames;
