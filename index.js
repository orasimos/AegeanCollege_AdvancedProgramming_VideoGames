const path = require("path");
const morgan = require("morgan");
const express = require("express");

//Αρχικοποίηση των routes σε σταθερές
const videogameRoutes = require("./routes/videogameRoutes");
const userRoutes = require("./routes/authRoutes");
const miscRoutes = require("./routes/miscRoutes");

//Χρήση της βιβλιοθήκης του framework "express"
const app = express();

//Χρήση του morgan για logging αν το environment είναι development
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//Χρήση του middleware "json" 
//για τη διαχείριση json στα requests
app.use(express.json());

//Ορισμός των base urls των routes
app.use("/api/videogames", videogameRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/misc", miscRoutes);

//Ορισμος του static αρχείο που θα σερβίρεται ως ιστοσελίδα
//για οπτικοποίηση των κλήσεων του api
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
