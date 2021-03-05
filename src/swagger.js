let options = {
    swaggerDefinition: {
        info: {
            description: "server API docs",
            title: "Contact Tracing API",
            version: "0.0.1",
        },
        host: "localhost:4683",
        basePath: "/api/v1",
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
