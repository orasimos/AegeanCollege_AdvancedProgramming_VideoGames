const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const isDevelopment = process.env.NODE_ENV
console.info('Environment: ', process.env.NODE_ENV);

const db = process.env.DB
    .replace("<db_username>", process.env.DB_USERNAME)
    .replace("<db_password>", process.env.DB_PASSWORD)
    .replace("<db_name>", isDevelopment ? '' : process.env.DB_NAME);

mongoose
    .connect(db)
    .then(() => {
        console.info("DB connection established");

        const app = require("./index.js");
        const port = process.env.PORT || 8100;
        
        app.listen(port, () => {
            console.info("Listening on port: ", port);
        });
    })
    .catch((err) => console.error(err));
