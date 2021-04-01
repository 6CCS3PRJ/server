/**
 * Options for generating swagger documentation
 *
 * This module was initially written for a separate project by Luka Kralj and I
 * and has been modified for the purposes of this project.
 * @author Danilo Del Busso <danilo.delbusso1@gmail.com>
 * @author Luka Kralj <luka.kralj.cs@gmail.com>
 */
let options = {
  swaggerDefinition: {
    info: {
      description: "Documentation for the REST API for WiFi Contact Tracing",
      title: "Contact Tracing REST API",
      version: "1.0.0"
    },
    host: `${process.env.DOMAIN}:${process.env.PORT}`,
    basePath: process.env.API_PREFIX,
    produces: ["application/json", "application/xml"],
    schemes: ["http"]
  },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.js"] //Path to the API handle folder
}

module.exports = {
  options
}
