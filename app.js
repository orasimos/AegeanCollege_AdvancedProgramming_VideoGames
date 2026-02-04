const mongoose = require("mongoose");
const dotenv = require("dotenv");
const initializeVideoGames = require("./data/load-data.js");

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";
if (isDevelopment) console.info("Environment: ", process.env.NODE_ENV);

//Δημιουργία connection string
//Αντικατάσταση των credentials από το .env
const db = process.env.DB.replace("<db_username>", process.env.DB_USER)
    .replace("<db_password>", process.env.DB_PASS)
    .replace("<db_name>", isDevelopment ? "" : process.env.DB_NAME);

//Σύνδεση με MongoDB
mongoose
    .connect(db)
    .then(async () => {
        console.info("DB connection established");

        //Αρχικοποίηση βάσης δεδομένων
        //(εκτέλεση script αν δωθεί ως argument --initialize)
        const initialize = process.argv.includes("--initialize");
        await initializeVideoGames(initialize);

        //Έναρξη του API και ορισμός listening port
        //(εν προκειμένω http://localhost:3000)
        const app = require("./index.js");
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.info("Listening on port: ", port);
        });
    })
    .catch((err) => console.error(err));
    