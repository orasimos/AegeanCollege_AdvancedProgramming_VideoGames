const mongoose = require("mongoose");

const VideoGameSchema = new mongoose.Schema({
    title: { type: String, require: [true, "A video game must have a title"], unique: true },
    releaseYear: { type: Number },
    rating: { type: Number, default: 5 },
    online: { type: Boolean },
    company: { type: String },
    type: { type: String },
    completionTime: { type: Number },
    description: { type: String },
    price: { type: Number },
    consoles: { type: [String] },
    difficulty: { type: String },
    images: { type: [String] },
    genreTags: { type: [String] },
    multiplayerModes: { type: [String] },
    languages: { type: [String] },
    metacriticURL: { type: String },
    awards: { type: [String] },
    availableOnStore: { type: Boolean },
    ageRating: { type: String },
});

const VideoGame = mongoose.model("VideoGame", VideoGameSchema);
module.exports = VideoGame;
