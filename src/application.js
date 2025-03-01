const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Import database connection
const db = require("./db");

// Import route handlers
const days = require("./routes/days");
const appointments = require("./routes/appointments");
const interviewers = require("./routes/interviewers");
const images = require("./routes/images");

/**
 * Reads a file and returns its content as a Promise.
 * @param {string} file - The file path.
 * @returns {Promise<string>} - The file content.
 */
function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: "utf-8" }, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}

/**
 * Initializes the Express application.
 * @param {string} ENV - The environment mode ("development", "test", or "production").
 * @param {object} actions - An object containing additional actions for the app.
 * @param {function} actions.updateAppointment - A function to handle WebSocket updates.
 * @returns {object} - The configured Express app.
 */
module.exports = function application(
  ENV,
  actions = { updateAppointment: () => {} }
) {
  // Middleware setup
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());

  // Register API routes
  app.use("/api", days(db));
  app.use("/api", appointments(db, actions.updateAppointment));
  app.use("/api", interviewers(db));

  // Register static image serving route
  app.use("/images", images);

  // Handle database reset in development/test mode
  if (ENV === "development" || ENV === "test") {
    Promise.all([
      read(path.resolve(__dirname, "db/schema/create.sql")),
      read(path.resolve(__dirname, `db/schema/${ENV}.sql`)),
    ])
      .then(([create, seed]) => {
        app.get("/api/debug/reset", (req, res) => {
          db.query(create)
            .then(() => db.query(seed))
            .then(() => res.status(200).send("Database Reset"))
            .catch((error) => res.status(500).send("Database reset failed"));
        });
      })
      .catch(() => console.error("Error setting up database reset route"));
  }

  // Close database connection when app shuts down
  app.close = () => db.end();

  return app;
};
