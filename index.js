const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

if (process.env.NODE_ENV === "production") {
    require("./src");
} else {
    require("nodemon")({ script: "dev.js" });
}
