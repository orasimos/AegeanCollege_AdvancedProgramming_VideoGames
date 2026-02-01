const mongoose = require("mongoose");
const dotenv = require("dotenv");
const initializeVideoGames = require("./data/load-data.js");

dotenv.config();

const isDevelopment = process.env.NODE_ENV;
console.info("Environment: ", process.env.NODE_ENV);

const db = process.env.DB
    .replace("<db_username>", process.env.DB_USER)
    .replace("<db_password>", process.env.DB_PASS)
    .replace("<db_name>", isDevelopment ? "" : process.env.DB_NAME);

mongoose
    .connect(db)
    .then(async () => {
        console.info("DB connection established");

        if (mongoose.connection.readyState === 1) {
            await initializeVideoGames();
        }

        const app = require("./index.js");
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.info("Listening on port: ", port);
        });
    })
    .catch((err) => console.error(err));
