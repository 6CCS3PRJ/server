let options = {
    swaggerDefinition: {
        info: {
            description: "server APi docs",
            title: "DEC App API",
            version: "0.0.1",
        },
        host: "localhost:5000",
        basePath: "/api",
        produces: ["application/json", "application/xml"],
        schemes: ["http", "https"],
        securityDefinitions: {
            JWT: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                description: "",
            },
        },
    },
    basedir: __dirname, //app absolute path
    files: ["./routes/**/*.js"], //Path to the API handle folder
};

module.exports = {
    options,
};
