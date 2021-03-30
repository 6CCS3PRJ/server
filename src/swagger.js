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
    schemes: ["http", "https"]
  },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.js"] //Path to the API handle folder
}

module.exports = {
  options
}
