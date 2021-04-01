/**
 * Main entry point for the application. Should be the target of npm start and npm run dev
 *
 * This module was initially written for a separate project by Luka Kralj and I
 * and has been modified for the purposes of this project.
 * @author Danilo Del Busso <danilo.delbusso1@gmail.com>
 * @author Luka Kralj <luka.kralj.cs@gmail.com>
 */
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })

if (process.env.NODE_ENV === "production") {
  require("./src")
} else {
  require("nodemon")({ script: "dev.js" })
}
