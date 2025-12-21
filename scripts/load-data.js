const mongoose = require("mongoose");
const fs = require("fs");
const VideoGame = require("../models/VideoGame");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const db = process.env.DB.replace("<db_username>", process.env.DB_USERNAME).replace("<db_password>", process.env.DB_PASSWORD);

const json = "video_games_dataset.json";

const seedData = async () => {
    try {
        await mongoose
            .connect(db)
            .then(() => console.log("DB connection established"))
            .catch((err) => console.log(err));

        const data = fs.readFileSync(json, "utf-8");
        const videoGames = JSON.parse(data);

        const result = await VideoGame.insertMany(videoGames);
        console.log(`${result.length} video games inserted successfully!`);
        
    } catch (err) {
        console.error("Failed to connect to MongoDB");
    } finally {
        mongoose.connection.close();
        console.log("Connection closed");
    }
};

seedData();
